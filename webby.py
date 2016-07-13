import restfs
import bottle
import os.path

def check(write, path):
    print('Hooo')
    return False

app = bottle.Bottle()
restfs.root = os.path.abspath('www')
restfs.authorized = check
app.mount('files', restfs.app)

app.run(debug=True)