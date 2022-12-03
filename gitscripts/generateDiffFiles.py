#!/usr/bin/env python3
from collections import Counter
import os
import subprocess
import time
import re

#use bat script to write git log to file in windows because doing it via python is infinitley harder 
#subprocess.call(["gitstuff.bat", "we", "are", "fun"])
#subprocess.call(["resetfiles.bat"])





time.sleep(0.1)
subprocess.call(["gitstuff.bat"])
time.sleep(0.1)

commit_ids = []
with open('log.txt') as f:
    lines = f.readlines()
    commit_ids = [line[7:-1] for line in lines if line.startswith("commit")]

for commit, latcommit in zip(commit_ids, commit_ids[1:]):
    subprocess.check_call(["gitdifffor2commits.bat", commit, latcommit])
    time.sleep(0.001)
    #print(commit + "    " + latcommit)
    
with open('diff.txt') as f:  
    lines = f.readlines()
    functions_touched = [line.replace("export", "").replace("default", "").replace("function", "").replace("+", "").replace("-", "").replace(" ", "").replace("\n", "").replace("{", "") for line in lines if line.find("function") != -1 and line.find("(") != -1]
    frequency = Counter(functions_touched)
    print(frequency)
    

