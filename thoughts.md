# crazy dammit stuff

Names:

ftp2web
dir2web

...too many different things.

1) different flavors:
    - files
    - editor
    - medias
    - sahring
2) different protocols:
    - system
    - ftp
    - webdav
    - onedrive/dropbox/google drive
    - smb
4) originally just a part of quickpage (editor flavor)



...how to combine this?

- it's partly orthogonal (shared API)
- but unique too: various "file protocol" have their own features (permissions, move/copy, read streaming chunk, share)
- allow extensions? (share? inline edit? preview?)

# SPP (Simplest Possible Plan)

1. share a dir on your filesystem ...BUT: this is kind of bad since it does not have SSL!
    - read-only / read-write
    - anonymous / users-passwords
2. FTP interface

**Both should be proxied by SSL gateway !!!**

**Better to...**

- Include HTTPS Proxy
- Async requests (through gevent)

# What is more useful?

fs2web:

- competes with onedrive, google drive, dropbox, owncloud, ftp drive...
- billing per user
- requires infrastructure
- doesn't solve a particular problem

+ more efficient (copy, move, unzip)
+ direct (no proxying)
+ more potential features (ACL, sharing, full text search, thumbnails)

ftp2web:

+ web clients are lagging behind
- there are already several "good enough" clients

+ requires no infrastructure
- inefficient since it proxies traffic
- low on features
- billing per org

---

thoughts:

make ftp2web first, since it's simpler and can still be used as "foot in the door"
for the more powerful alternative of dir2http

# What makes money? 

- (1) is complicated because it requires upfront user billing, infrastructure, support
- (2) can be provided as a service, and offer a cost to be integrated


# Sample command line for (1)

Share current working directory with every one as read-only access on port 80:

``python dir2web``

```
Options:

-d <directory-path> The directory to serve (by default, the current working directory)
-p <port> The port to run as (by default 80)
-a <access-rights> A file containing a list of users, passwords and access rights

Access rights file:
---
user: anonymous
password: 
rights: read
---
user: alice
password: clear secret
rights: read
---
user: bob
password: sha256 2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25b
rights: write
---
user: charlie
password: md5 5ebe2294ecd0e0f08eab7690d2a6ee69
rights: add-only 
```

# restfs

A REST filesystem backend for python, using bottle

### The client side is tough...

- For images: show in preview
- For json, js, css... : show in editor
- For HTML... : show both editor and preview
- For dir: list dir content and upload

...if we want to integrate with temser, it might depend on the extension itself (*.md, *.tmd, *.tml)

### ...how to make this relatively flexible?

Some want the filesystem REST API.
Some want the admin web interface.
Some want neither.

A look at temser:

- `/...` serves the templates
- `/@files` is the filesystem API
- `/@admin` is the file API?
 
...for temser, ideally, some things editable.


Just drop all that and use FTP with temser???

Focus on examples instead??

...or simplify everything?

- no tree
- no drag&drop
- edit on demand

### Long term

- one frontend
- multiple backends (REST APIs)

