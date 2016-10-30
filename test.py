import restfs
import sys

restfs.post('/tests', cmd='mkdir')
restfs.post('/tests/foo/nested', cmd='mkdir')

restfs.post('/tests/foo', cmd='rename', to='bar')
