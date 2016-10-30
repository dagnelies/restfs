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

