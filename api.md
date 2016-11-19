POST /login?username=...&password=...

GET /help - returns information about the server and the available list of commands

GET /list?path=...&details=true|false - list the dir's content, details are "name,size,type=file|dir|link,modified[,created,owner,rights]"
GET /read?path=...[&range=123-256] - reads a file or a portion of it (optional feature)
GET /info?path=... - infos about a file

POST /write?path=...&override=true|false - writes the request body into the file
POST /upload?path=...&override=true|false - interprets the request body as multi-file-upload mime type and write the corresponding files
POST /append?path=... - appends to a file
POST /mkdir?path=... - makes a dir
POST /copy?path=...&to=...&override=true|false - copies a directory or file (if `to` is a directory, place a copy with same name inside it. Otherwise use it as target path.)
POST /move?path=...&to=...&override=true|false - moves a directory or file (if `to` is a directory, move inside it. Otherwise use it as target path.)
POST /rename?path=...&into=... - renames a directory or file
POST /delete?path=...
POST /abord - abords ongoing operations (both read and writes)

POST /alive - prolonges the session
POST /logout - exits