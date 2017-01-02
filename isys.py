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
from canister import session


config_json = open('config.json')
config = json.load(config_json)
config_json.close()

root = os.path.abspath(config['root'])
users = {}

for u in config['users']:
    print(u)
    users[u['username']] = u
    
app = bottle.Bottle()
app.install(canister.Canister())


def fullpath(path):
    global root
    fp = os.path.join(root, path.strip('/'))
    fp = os.path.abspath(fp)
    app.log.debug('Full path: %s' % fp)
    if not fp.startswith(root):
        raise Exception('Path forbidden: ' + path)
    else:
        return fp

@app.route('/login')
def login(username, password):
    if username in users:
        session.data['user'] = username
        return 'OK'
    else:
        raise Exception('Invalid creditentials')
    
@app.get('/list')
def list(path='', hidden=False):
    if 'user' not in session.data:
        raise Exception('Please login first')
    
    global root
    fpath = fullpath(path)
    
    if not os.path.exists(fpath):
        raise Exception('No such path: ' + path)
        
    if not os.path.isdir(fpath):
        raise Exception('Path is not a directory: ' + path)
    
    files = os.listdir(fpath)
    listing = []
    for name in files:
        if not hidden and name[0] == '.':
            continue
        p = os.path.join(fpath, name)
        item = {}
        item['name'] = name
        if os.path.isdir(p):
            item['type'] = 'dir'
        elif os.path.islink(p):
            item['type'] = 'link'
        else:
            item['type'] = 'file'
        item['size'] = os.path.getsize(p)
        item['last_modified'] = time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime( os.path.getmtime(p) ) )
        
        listing.append( item )
        listing.sort(key=lambda x: (x['type'], x['name']) )
        
    bottle.response.content_type = 'application/json'
    return json.dumps(listing)
        


@app.get('/read')
def read(path='', hidden=False):
    if 'user' not in session.data:
        raise Exception('Please login first')
        
    global root
    fpath = fullpath(path)
    
    if not os.path.exists(fpath):
        raise Exception('No such path: ' + path)
        
    if not os.path.isfile(fpath):
        raise Exception('Path is not a file: ' + path)
        
    return bottle.static_file(path, root=root)


@app.post('/write')
def write(path, override):
    if not app.session.data['user']:
        raise Exception('Please login first')
        
    fpath = fullpath(path)
    
    content = bottle.request.body.readall()
    file = open(fpath, mode='w')
    file.write(content)
    file.close()

@app.post('/append')
def append(path):
    if not app.session.data['user']:
        raise Exception('Please login first')
        
    fpath = fullpath(path)
    
    content = bottle.request.body.readall()
    file = open(fpath, mode='a')
    file.write(content)
    file.close()
    
@app.post('/upload')
def upload(path, override):
    if 'user' not in session.data:
        raise Exception('Please login first')
        
    fpath = fullpath(path)
    for name, up in bottle.request.files.items():
        file = open(os.path.join(fpath, name), mode='w')
        file.write(up)
        file.close()

@app.post('/mkdir')
def mkdir(path):
    if 'user' not in session.data:
        raise Exception('Please login first')
        
    fpath = fullpath(path)
    os.makedirs(fpath, exist_ok=True)
    
@app.post('/move')
def move(path, to, override=True):
    if 'user' not in session.data:
        raise Exception('Please login first')
        
    fpath = fullpath(path)
    fto = fullpath(to)
    shutil.move(fpath, fto)

@app.post('/rename')
def rename(path, into, override=True):
    if 'user' not in session.data:
        raise Exception('Please login first')
        
    fpath = fullpath(path)
    os.rename(fpath, into)

@app.post('/copy')
def copy(path, to, override=True):
    if 'user' not in session.data:
        raise Exception('Please login first')
        
    fpath = fullpath(path)
    fto = fullpath(to)
    shutil.copy(fpath, fto)
    


@app.post('/delete')
def delete(path):
    if 'user' not in session.data:
        raise Exception('Please login first')
        
    fpath = fullpath(path)
    shutil.rmtree(fpath)


@app.route('/alive')
def alive():
    return "true"


@app.route('/logout')
def logout():
    del session.data['user']

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

