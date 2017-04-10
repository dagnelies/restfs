import dateutil.parser
import sys


def parseList(raw):
    files = []
    for line in raw.splitlines():
        files.append(parseLine(line))
        
    return files
    
def parseLine(line):
    # mode	    links owner    group 	    size   datetime   name
    # drwxr-xr-x    9 1176     1176         4096 Nov 12 09:03 debian
    # drwxr-xr-x    9 1176     1176         4096 Nov 12 09:03 name with spaces
    # -rw-r--r--    1 ftp      ftp             0 Nov 06 09:13 FILELIST.gz
    # drwxr-xr-x   10 ftp      ftp          4096 Feb 04  2013 pub
    # lrwxrwxrwx    1 ftp      ftp            17 May 25  2007 ubuntu -> pub/linux/ubuntu/
    # -rw-r--r--    1 0        0         5242880 Feb 19  2016 5MB.zip
    # drwxr-xr-x    2 105      108          4096 Nov 12 14:16 upload
    # lrwxr-xr-x    1 ftp      ftp            31 May 19  2008 redhat -> mirrors/redhat.com/redhat/linux
    # -rw-rw-r--    1 ftp      ftp           135 May 24  2011 robots.txt
    # drwxr-xr-x    4 ftp      ftp          2048 Oct 16  2012 rrzk
    # -rwxr--r--    1 owner   group        13440 1970 01 01   test.html
    # -rw-r--r--    1 37423    dano2413      462 Aug 25 19:17 smiley16.gif
    # -rw-r--r--    1 ftp       ftp          489 Dec 10 12:57 smiley14.gif
    
    # Windows IIS apparently looks like this:
    # 10-24-06  04:10PM                  757 getmusic.ashx
    print(line)
    tokens = line.split()
    mode = tokens[0]
    links = tokens[1]
    owner = tokens[2]
    group = tokens[3]
    size = tokens[4]
    modified = tokens[5:8]
    name = tokens[8:]
    
    modified = str(dateutil.parser.parse(' '.join(modified)))
    print(modified)

from ftplib import FTP

#ftp = FTP('ftp.cluster020.hosting.ovh.net')
#ftp.login('moviesalmu-ftp','asdASD123')

print('Hi!')
#ftp.retrlines('FEAT') 

#ftp = FTP('ftp.mozilla.org')
ftp = FTP('test.talia.net')
#ftp = FTP('ftp.uni-koeln.de')     # connect to host, default port
ftp.login()        # user anonymous, passwd anonymous@

try:
    files = list(ftp.mlsd())
except:
    print('mlsd failed')
    files = []

for f in files:
    print(f)

ftp.quit()
sys.exit()


a = ftp.dir('/debian', parseList)           # list directory contents
print('-----------LISTING DONE-------------')

file = '/debian/README.mirrors.html'
s = ftp.size(file)
d = 0
def download(b):
    global d
    d += len(b)
    #print('%d%%' % (100*d/s))
    
ftp.retrbinary('RETR ' + file, download)
print('-----------DOWNLOAD DONE-------------')

ftp.quit()
