
import canister
import bottle
import os.path
import json
import sys
import shutil
import time
import ftplib

app = bottle.Bottle()
app.install(canister.Canister())


def connect(address, username, password):
    if 'connection' in app.session:
        app.session['connection'].quit()
        
    conn = ftplib.FTP('ftp.uni-koeln.de')
    conn.login(username, password)
    app.session['connection'] = conn

@app.get('<path:path>')
def get(path='', hidden=False, jstree=False):
    pass