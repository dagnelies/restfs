import fs
import json

print('--- start ---')

t = fs.open_fs('osfs://.')

for f in t.scandir('/', namespaces=['details']):
    print( f.raw )

t.close()

print('--- end ---')
