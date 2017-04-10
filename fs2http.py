import canister
import bottle
import os.path
import json
import sys
import shutil
import time


# TODO
# - exceptions might reveal real paths
# - authorization

# a callback that can be replaced to determine whether a resource is allowed access or not
# by default, read access is authorized and write access forbidden
def authorized(write):
    #return not write
    return True

root = os.getcwd()
app = bottle.Bottle()
app.install(canister.Canister())


def fullpath(path):
    global root
    fp = os.path.join(root, path.strip('/'))
    fp = os.path.abspath(fp)
    if not fp.startswith(root):
        raise Exception('Path forbidden: ' + path)
    else:
        return fp


@app.get('/get')
def _get(path='', hidden=False):
    if not authorized(False, path):
        return bottle.Response(status=401) # TODO
        raise Exception('Unauthorized path: ' + path)
    
    global root
    fpath = fullpath(path)
    print(fpath)
    
    if os.path.isfile(fpath):
        return bottle.static_file(path, root=root)
    elif os.path.isdir(fpath):
        files = os.listdir(fpath)
        listing = []
        for name in files:
            if not hidden and name[0] == '.':
                continue
            p = os.path.join(fpath, name)
            item = {
                'name': name,
                'type': 'dir' if os.path.isdir(p) else 'file',
                'size': os.path.getsize(p),
                'last_modified': time.ctime(os.path.getmtime(p))
            }
            listing.append( item )
            listing.sort(key=lambda x: x['name'])
            
        bottle.response.content_type = 'application/json'
        return json.dumps(listing)
    else:
        raise Exception('No such path: ' + path)


@app.post('/set'):
def _set(path):
    if not authorized(True, path):
        return bottle.Response(status=401)
        raise Exception('Unauthorized path: ' + path)
    fpath = fullpath(path)
    content = bottle.request.body.readall()
    file = open(fpath, mode='w')
    file.write(content)
    file.close()
    
@app.post('/upload'):
def upload(path):
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

