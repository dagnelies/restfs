Protocol
========

Core operations
---------------

```
POST /login
    username=...
    password=...

GET /alive

GET /help

GET /list - list the dir's content
    path=...
    
GET /read - reads a file
    path=...

POST /write - writes a file
    path=...
    append=false
    override=false
    
POST /mkdir - makes a dir
    path=...
    

POST /mkfile - makes an empty file
    path=...
    
POST /copy
    path=...
    to=...
    override=false
    
POST /move
    path=...
    to=...
    override=false
    
POST /delete
    path=...

POST /logout
```

Listing results:
```
path
content
    filename
    type: dir|file|link
    size:
    last modified:
```

Optional operations
-------------------
```
GET /info - infos about a file
    path=...

GET /thumbnail - reads a file
    path=...
    width=...
    height=...

POST /share
    path=...
    
GET /find
    path=...
    pattern=...
    recursive=true
    limit=100
    
GET /search (full text search)

GET /grep
```

Optional access control lists
-----------------------------
```
GET /access
    path=...
    
POST /access
    path=...
    user=...
    group=...
    mode=read|add|write|admin
    
GET /users
GET /groups
GET /members

POST /user
POST /group
POST /members

DELETE /user
DELETE /group
DELETE /members
```