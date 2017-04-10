#import restfs
import sys
from ftplib import FTP

#ftp = FTP('ftp.debian.org')     # connect to host, default port
#ftp = FTP('ftp.otenet.gr')
#ftp = FTP('speedtest.tele2.net')
ftp = FTP('ftp.uni-koeln.de')
ftp.login()                     # user anonymous, passwd anonymous@

res = ftp.dir()
print(res)


ftp.quit()
exit()

print(ftp.sendcmd('HELP'))
print(ftp.sendcmd('STAT'))

ftp.dir()
print(list(ftp.nlst()))
#print(list(ftp.mlsd()))
#ftp.dir('debian/tools')
#print(list(ftp.mlsd('debian/tools',  ["type", "size"])))
#print(list(ftp.nlst('debian/tools')))

ftp.cwd('debian')
ftp.retrlines('LIST')
ftp.cwd('tools')
ftp.retrlines('LIST')

#restfs.post('/tests', cmd='mkdir')
#restfs.post('/tests/foo/nested', cmd='mkdir')
#restfs.post('/tests/foo', cmd='rename', to='bar')
