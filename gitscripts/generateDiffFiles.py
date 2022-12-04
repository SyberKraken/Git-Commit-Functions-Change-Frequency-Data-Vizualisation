#!/usr/bin/env python3
from collections import Counter
import os
import subprocess
import time
import re
from tqdm import tqdm

#OBS this is not optimized for performance at all and we are reading from, writing to and copying files.
#i have added some progress bars so that it will more clear that it is runnig and is not stuck, there is defenitley a 
#faster way to get the data from "git" console commands into lists in our file, but i havent found it yet.
#thus if you are using a BIG framework or just huge libraries that are included in the git logs it will take a while
#if they are just added in the initial commit a hack is to skip the first git diff

#use bat script to write git log to file in windows because doing it via python is infinitley harder 
#OBS this only works on windows for now, but with the linux version you should not have to do as much work as this file is doing with windows.
#technicly this part of thje project is all that is required for it to work

#path becomes your absolutepath when run

path = os.path.dirname(os.path.abspath(__file__))
other_repo_path =  path + "/test"  #change this for your own repos abs path R'C:\Users\simon\Documents\My Web Sites\nextjsproject'

batfiles = ["gitlogfile.bat", "gitdifffile.bat"]
batfilenames = ["log.txt", "diff.txt"]
#mbe not neccesairy
#TODO: generate script files here and dont have files at startup to rely on git diff %1 %2 >> diff.txt git log > log.txt
#rewrite CD path to current systems absolute path in relevant files
i = 0
for file in tqdm(batfiles):
    lines = ""
    with open(file) as f:
        lines = f.readlines()
        lines[0] = "cd " + other_repo_path + "\n"
        lines[2] = "copy ./" + batfilenames[i] +' "' + path + '/"\n'
    with open(file, 'w') as f:
        f.writelines(lines)
    i+=1

#most of the sleep statements can be reduced or removed, but if oyu are using large files/repos or slow drives oyu might want to have them included or increased
time.sleep(0.1)
subprocess.call(["gitlogfile.bat"])
time.sleep(0.1)

commit_ids = []
with open('log.txt') as f:
    lines = f.readlines()
    commit_ids = [line[7:-1] for line in lines if line.startswith("commit")]

print("generating differences in git commits into file...")
for commit, latcommit in tqdm(zip(commit_ids, commit_ids[1:])):
    subprocess.check_call(["gitdifffile.bat", commit, latcommit])
    time.sleep(0.001)
    #print(commit + "    " + latcommit)

frequency = Counter()

with open('diff.txt') as f:  
    lines = f.readlines()

    #TODO: make regex expression that matches all 3 of the valid function syntaxes, this will improve performance drasticly.

    #matches all named functions delared with "function" syntax
    print("searching for function definitions...")
    functions_touched = [line for line in tqdm(lines) if re.search("function +[a-z0-9A-Z_]*\(", line)]

    #matches all named functions delared with "=>" syntax
    #OBS this does not match arrow functions without parenthesis around the parameters since it is impossible in typescript.
    #to add this simply copy the below expression and remove the parenthesis V               V  indicated by the V's
    print("searching for arrow function definitions...")
    named_arrow = [line for line in tqdm(lines) if re.search("[A-Za-z0-9]+[ ]=[ ]+\([A-Za-z0-9: ]*\)[ ]*=>", line)]
    print("searching for async arrow function definitions...")
    async_named_arrow = [line for line in tqdm(lines) if re.search("[A-Za-z0-9]+[ ]=[ ]+async[ ]+\([A-Za-z0-9: ]*\)[ ]*=>", line)]

combinedLists = functions_touched + named_arrow + async_named_arrow

combinedLists = [line for line in tqdm(combinedLists) if line.find("eval(") == -1] #remove eval calls wich in some frameworks somehow sneak through the regex, TODO: make better regex

print("removing async label...")
combinedLists = [re.sub("=[ ]*async[ ]*", "", line) for line in tqdm(combinedLists)] #remove async tag
print("removing syntax symbols and expresisons and git +-...")
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
 for line in tqdm(combinedLists)]
print("removing git metadata...")
combinedLists = [re.sub("@@.*@@", "", line) for line in tqdm(combinedLists)]  # removes lines where git puts the functon on the same row as some metadata

frequency = Counter(combinedLists)
print("generating json data...")
jsondata =  [{'x':key, 'y':value} for key,value in tqdm(frequency.items())]
print("generating json file...")
with open('result.json', 'w') as f: 
    f.writelines(["[" +"\n  " ] )
    f.writelines([str(jsondata[0]).replace("'", '"')] )
    for row in tqdm(jsondata[1:]):
        f.writelines(["," + "\n  " + str(row).replace("'", '"')])

    f.writelines(["\n" +"]"] )


print("generating json file...")
#cleans up files in other repo and current folder
lines = ""
with open("resetfiles.bat") as f:
        lines = f.readlines()
        lines[0] = "del log.txt \n"
        lines[1] = "del diff.txt \n"
        lines[2] = "cd " + other_repo_path + "\n"
        lines[3] = "del log.txt \n"
        lines[4] = "del diff.txt \n"
with open("resetfiles.bat", 'w') as f:
    f.writelines(lines)
#if you want to see the outputs from the git commands comment out this call and it will leave the files
subprocess.call(["resetfiles.bat"])
print("done :) find your results in the data.json file")
