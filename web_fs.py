import bottle
import sys
import rest_fs

app = bottle.Bottle()

@app.get('<path:path>')
def serve(path):
    if not path or path == '/':
        path = 'admin.html'
    return bottle.static_file(path, root='static')

if __name__ == '__main__':
    print(sys.argv)
    args = sys.argv
    #if len(args) != 2:
    #    print('Usage: %s <path-to-serve>' % os.path.basename(args[0]))
    #root = os.path.abspath(args[1])
    #root = os.getcwd()
    import isys
    app.mount('@api', isys.app)
    
    
    app.run(debug=True, host='0.0.0.0')
