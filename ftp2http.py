"""
REST File Server
================

Operations:
get - GET /path/to/file => returns the file
get - GET /path/to/dir => returns the dir's content as json list
set -
upload - path can be dir, or existing file with "override=true"
mkdir - create single dir
copy - to=...
move - to=...
delete - DELETE
info - HEAD

Authentication?
- public read: true/false
- write: username/password
- callback
"""

import canister
import bottle
import os.path
import json
import sys
import shutil
import time

root = os.getcwd()
app = bottle.Bottle()
app.install(canister.Canister())

@app.get('<path:path>')
def get(path='', hidden=False, jstree=False):
    listing = []
    for name in files:
        if not hidden and name[0] == '.':
            continue
        p = os.path.join(fpath, name)
        item = {}
        
        if jstree:
            item['id'] = path + '/' + name
            item['text'] = name
            item['children'] = os.path.isdir(p)
            if not item['children']:
                tokens = name.strip('.').split('.')
                if len(tokens) > 1:
                    item['icon'] = '/ext/' + tokens[-1].lower() + '.png'
                else:
                    item['icon'] = '/ext/file.png'
        else:
            item['name'] = name
            item['isdir'] = os.path.isdir(p)
            item['size'] = os.path.getsize(p)
            item['last_modified'] = time.ctime(os.path.getmtime(p))
            
        listing.append( item )
        
        if jstree:
            listing.sort(key=lambda x: x['text'])
        else:
            listing.sort(key=lambda x: x['name'])
        
    bottle.response.content_type = 'application/json'
    return json.dumps(listing)


@app.post('<path:path>')
def post(path, cmd, to=None):
    if not authorized(True, path):
        return bottle.Response(status=401)
        raise Exception('Unauthorized path: ' + path)
    # TODO: exceptions might reveal real paths
    fpath = fullpath(path)
    app.log.debug('Full path: %s' % fpath)
    
    cmd = cmd.lower()
    if cmd == 'set':
        content = bottle.request.body.readall()
        file = open(fpath, mode='w')
        file.write(content)
        file.close()
    elif cmd == 'upload':
        for name, up in bottle.request.files.items():
            file = open(os.path.join(fpath, name), mode='w')
            file.write(up)
            file.close()
    elif cmd == 'mkdir':
        # os.mkdir
        # build dirs recursively
        os.makedirs(fpath, exist_ok=True)
    elif cmd == 'move':
        if not to:
            raise Exception('Missing destination ("to=...")')
        fto = fullpath(to)
        shutil.move(fpath, fto)
    elif cmd == 'rename':
        if not to:
            raise Exception('Missing destination ("to=...")')
        os.rename(fpath, to)
    elif cmd == 'copy':
        if not to:
            raise Exception('Missing destination ("to=...")')
        fto = fullpath(to)
        shutil.copy(fpath, fto)
    else:
        raise Exception('Unknown command: %s' % cmd)


@app.delete('<path:path>')
def delete(path):
    if not authorized(True, path):
        raise Exception('Unauthorized path: ' + path) # TODO: return response instead
    fpath = fullpath(path)
    shutil.rmtree(fpath)

if __name__ == '__main__':
    
    print(sys.argv)
    args = sys.argv
    #if len(args) != 2:
    #    print('Usage: %s <path-to-serve>' % os.path.basename(args[0]))
    #root = os.path.abspath(args[1])
    #root = os.getcwd()
    import webfs
    app.mount('@admin', webfs.app)
    
    print('Serving: ' + root)
    app.run(debug=True, host='0.0.0.0')

