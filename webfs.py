import restfs
import bottle
import os.path

def check(write, path):
    print('Authorized?')
    return not write

app = bottle.Bottle()
restfs.root = os.path.abspath('.')
restfs.authorized = check
app.mount('/@files', restfs.app)

@app.get('/')
def index():
    return serve('/index.html')

@app.get('/<path:path>')
def serve(path):
    return bottle.static_file(path, root='admin')


app.run(debug=True, host='0.0.0.0')