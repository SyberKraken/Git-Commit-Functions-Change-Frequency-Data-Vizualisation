#!/usr/bin/env python3
from collections import Counter
import os
import subprocess
import time
import re

#use bat script to write git log to file in windows because doing it via python is infinitley harder 
#subprocess.call(["gitstuff.bat", "we", "are", "fun"])


#if you want to use any git repo, change this path to whereever you want to run it and maybe also need to add the path to the subprocess calls on 32, 41
path = os.path.dirname(os.path.abspath(__file__))

batfiles = ["gitlogfile.bat", "gitdifffile.bat"]

#mbe not neccesairy
#rewrite CD path to current systems absolute path in relevant files
for file in batfiles:
    lines = ""
    with open(file) as f:
        lines = f.readlines()
        lines[0] = "cd " + path + "\n"
    with open(file, 'w') as f:
        f.writelines(lines)





time.sleep(0.1)
subprocess.call(["gitlogfile.bat"])
time.sleep(0.1)

commit_ids = []
with open('log.txt') as f:
    lines = f.readlines()
    commit_ids = [line[7:-1] for line in lines if line.startswith("commit")]

for commit, latcommit in zip(commit_ids, commit_ids[1:]):
    subprocess.check_call(["gitdifffile.bat", commit, latcommit])
    time.sleep(0.001)
    #print(commit + "    " + latcommit)

frequency = Counter()

with open('diff.txt') as f:  
    lines = f.readlines()
    functions_touched = [line
    .replace("export", "")
    .replace("default", "")
    .replace("function", "")
    .replace("+", "")
    .replace("-", "")
    .replace(" ", "")
    .replace("\n", "")
    .replace("{", "") for line in lines if line.find("function") != -1 and re.search("function +[a-z0-9A-Z_]*\(", line)]
    frequency = Counter(functions_touched)

jsondata =  [{'name':key, 'value':value} for key,value in frequency.items()]


with open('result.json', 'w') as f: 
    f.writelines(["[" +"\n  " ] )
    f.writelines([str(jsondata[0]).replace("'", '"')] )
    for row in jsondata[1:]:
        f.writelines(["," + "\n  " + str(row).replace("'", '"')])

    f.writelines(["\n" +"]"] )
#cleans up files
subprocess.call(["resetfiles.bat"])