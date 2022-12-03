#!/usr/bin/env python3
from collections import Counter
import os
import subprocess
import time
import re

#use bat script to write git log to file in windows because doing it via python is infinitley harder 
#OBS this only works on windows for now, but with the linux version you should not have to do as much work as this file is doing with windows.


#path becomes your absolutepath when run, if you want to use another git repo and not have theese files in it, change this path to whereever you want to run it and maybe also need to add the path to the subprocess calls on 32, 41
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
    #matches all named functions delared with "function" syntax
    functions_touched = [line for line in lines if re.search("function +[a-z0-9A-Z_]*\(", line)]

    #matches all named functions delared with "=>" syntax
    #OBS this does not match arrow functions without parenthesis around the parameters since it is impossible in typescript.
    #to add this simply copy the below expression and remove the parenthesis V               V  indicated by the V's
    named_arrow = [line for line in lines if re.search("[A-Za-z0-9]+[ ]=[ ]+\([A-Za-z0-9: ]*\)[ ]*=>", line)]
    async_named_arrow = [line for line in lines if re.search("[A-Za-z0-9]+[ ]=[ ]+async[ ]+\([A-Za-z0-9: ]*\)[ ]*=>", line)]
    
combinedLists = functions_touched + named_arrow + async_named_arrow

combinedLists = [re.sub("=[ ]*async[ ]*", "", line) for line in combinedLists] #remove async tag

combinedLists = [line
    .replace("=>", "")
    .replace("let", "") 
    .replace("const", "") 
    .replace("-", "") 
    .replace("+", "") 
    .replace(" ", "") 
    .replace("\n", "")
    .replace("export", "")
    .replace("default", "")
    .replace("function", "")
    .replace("{", "")
    .replace("=", "") 
 for line in combinedLists]

combinedLists = [re.sub("@@.*@@", "", line) for line in combinedLists]  # removes lines where git puts the functon on the same row as some metadata

frequency = Counter(combinedLists)

jsondata =  [{'x':key, 'y':value} for key,value in frequency.items()]


with open('result.json', 'w') as f: 
    f.writelines(["[" +"\n  " ] )
    f.writelines([str(jsondata[0]).replace("'", '"')] )
    for row in jsondata[1:]:
        f.writelines(["," + "\n  " + str(row).replace("'", '"')])

    f.writelines(["\n" +"]"] )
#cleans up files
subprocess.call(["resetfiles.bat"])