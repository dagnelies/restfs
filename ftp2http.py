
import canister
import bottle
import os.path
import json
import sys
import shutil
import time

root = os.getcwd()
app = bottle.Bottle()
app.install(canister.Canister())

@app.get('<path:path>')
def get(path='', hidden=False, jstree=False):
    pass