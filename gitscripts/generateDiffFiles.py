#!/usr/bin/env python3
from collections import Counter
import os
import subprocess
import time
import re
from tqdm import tqdm

# OBS this is not optimized for performance at all and we are reading from, writing to and copying files.
# i have added some progress bars so that it will more clear that it is runnig and is not stuck, there is defenitley a 
# faster way to get the data from "git" console commands into lists in our file, but i havent found it yet.
# thus if you are using a framework or just have huge libraries that are included in the git logs it will take a while

#use bat script to write git log to file in windows because doing it via python is infinitley harder 
#OBS this only works on windows for now, but with the linux version you should not have to do as much work as this file is doing with windows.
#gitscripts are standalone and will work even without the frontend data vizualisation

#This only matches TS function and arrow function defenitions, for other langueges write regex representing a function in  that languege and add them to "combinedLists"

#path becomes your absolutepath when run


#generates precentage of commits realting to an item wich are bugfixes compared to number of actual changes made to a function



def generate_result():
    path = os.path.dirname(os.path.abspath(__file__))
    other_repo_path =  path + "/test"  #change other_repo_path for your own repos abs path like this -> R'C:\Users\simon\Documents\My Web Sites\nextjsproject' 

    batfiles = ["gitlogfile.bat", "gitdifffile.bat"]
    batfilenames = ["log.txt", "diff.txt"]

    #TODO: generate script files here and dont have files at startup to rely on git diff %1 %2 >> diff.txt git log > log.txt

    #rewrites CD path to current systems absolute path in relevant files
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

    #most of the sleep statements can be reduced or removed, but if you do sometimes it might fail to give the correct output
    time.sleep(0.1)
    subprocess.call(["gitlogfile.bat"])
    time.sleep(0.1)




    commit_ids = []
    with open('log.txt') as f:
        lines = f.readlines()
        commit_ids = [line[7:-1] for line in lines if line.startswith("commit")]

        #OLD VERSION finds all funcitons with list comprehensions and regex
        #matches all named functions delared with "function" syntax
        print("searching for function definitions...")
        functions_touched = [re.search("function[ ]+[a-z0-9A-Z_]+\(+[a-z0-9A-Z_:, ]*\)", line).group().replace("function", "").replace(" ", "") for line in tqdm(lines) if re.search("function[ ]+[a-z0-9A-Z_]+\(+[a-z0-9A-Z_:, ]*\)", line)] 

        #matches all named functions delared with "=>" syntax
        #OBS this does not match arrow functions without parenthesis around the parameters since it is impossible in typescript.
        print("searching for arrow function definitions...")
        named_arrow = [re.search("[A-Za-z0-9]+[ ]=[ ]+\([A-Za-z0-9: ]*\)[ ]*=>", line).group().replace("=>", "").replace(" ", "") for line in tqdm(lines) if re.search("[A-Za-z0-9]+[ ]=[ ]+\([A-Za-z0-9: ]*\)[ ]*=>", line)]
        print("searching for async arrow function definitions...")
        async_named_arrow = [re.search("[A-Za-z0-9]+[ ]=[ ]+async[ ]+\([A-Za-z0-9: ]*\)[ ]*=>", line).group().replace("=>", "").replace(" ", "") for line in tqdm(lines) if re.search("[A-Za-z0-9]+[ ]=[ ]+async[ ]+\([A-Za-z0-9: ]*\)[ ]*=>", line)]

        #NEW VERSION parses the text file line for line to count functions ion bugfixes
        in_note = False
        in_bugfix = False
        bugfixed_functions = []
        #list commits who are relevant to bugfixes
        for line in lines:
            bug_async_named_arrow  = ''
            bug_named_arrow = ''
            bug_function = ''
            if line.startswith("commit"):
                in_bugfix = False
            if line.startswith("Notes"):
                in_note = True
            if in_note:
                if "bugfix" in line:
                    in_note = False
                    in_bugfix =True

            if in_bugfix:
                
                bug_async_named_arrow_search = re.search("[A-Za-z0-9]+[ ]=[ ]+async[ ]+\([A-Za-z0-9: ]*\)[ ]*=>", line)
                if bug_async_named_arrow_search:
                    bug_async_named_arrow = bug_async_named_arrow_search.group().replace("=>", "").replace(" ", "")
                    bugfixed_functions.append(bug_async_named_arrow)

                bug_named_arrow_search = re.search("[A-Za-z0-9]+[ ]=[ ]+\([A-Za-z0-9: ]*\)[ ]*=>", line)
                if bug_named_arrow_search:
                    bug_named_arrow = bug_named_arrow_search.group().replace("=>", "").replace(" ", "")
                    bugfixed_functions.append(bug_named_arrow)

                bug_function_search = re.search("function[ ]+[a-z0-9A-Z_]+\(+[a-z0-9A-Z_:, ]*\)", line)
                if(bug_function_search):
                    bug_function = bug_function_search.group().replace("function", "").replace(" ", "")
                    bugfixed_functions.append(bug_function)

    
    bug_fix_frequency_per_function = Counter(bugfixed_functions)

    frequency = Counter()
    combinedLists = functions_touched + named_arrow + async_named_arrow
    #remove eval calls wich in some frameworks somehow sneak through the regex, TODO: make better regex
    combinedLists = [line for line in tqdm(combinedLists) if line.find("eval(") == -1] 
    frequency = Counter(combinedLists)

    # make elements into the precentage of changes that are bug fixes
    for f in frequency:
        if bug_fix_frequency_per_function[f]:
            frequency[f] = (bug_fix_frequency_per_function[f]/frequency[f])*100
        else:
            frequency[f] = 0.01
    


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
    print("done :) find your results in the result.json file")

if(__name__ == "__main__"):
    generate_result()