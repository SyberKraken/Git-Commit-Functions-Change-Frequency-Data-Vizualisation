import { execSync } from 'child_process';
import { tmpdir, type } from 'os';
import { join } from 'path';
import del from 'del';
import { spawnSync } from 'child_process';
const cliProgress = require('cli-progress');
const sleep = require('sleep');
type frequencyPairing = { x: string, y: number };

export default function getGitLog(repoUrl: string) {
  try {
    // Create a temporary directory to clone the repository into
    const tempDir = tmpdir();
    const repoDir = join(tempDir, 'repo' + Math.floor(Math.random()*9999).toString());

    // Clone the repository
    execSync(`git clone ${repoUrl} ${repoDir}`);
    sleep.sleep(2)
    // Initialize a counter to keep track of the function names and their frequencies
    const counter = new Map<string, number>();
    let commits_to_functions = new Map<string, string[]>()
    // Run the git diff command to get the SHA of the initial commit
    let all_sha = execSync(`git --git-dir=${repoDir}/.git --work-tree=${repoDir} rev-list HEAD`).toString().trim();
    let sha_list = all_sha.split("\n")

    //console.log(sha_list)
    // Loop through the git diffs and process each one
    let errors = 0;
    let count = 0
    const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    bar1.start(sha_list.length, 0);
    sha_list.forEach ( (sha) =>{
      count++
      bar1.update(count)
      
      try {
         //console.log(sha)
      // Run the git diff command for the current commit
      const diff = execSync(`git --git-dir=${repoDir}/.git --work-tree=${repoDir} diff ${sha}`, {maxBuffer: 1024 * 1024 * 1024 * 9999999 }).toString();
     
      let function_list = Array<string>()
      getFunctionsFromDiff(diff, function_list)
      commits_to_functions.set(sha, function_list)

      // Get the SHA of the parent commit for the next iteration
      sha = execSync(`git --git-dir=${repoDir}/.git --work-tree=${repoDir} rev-list ${sha}^ --max-count=1`).toString().trim();
      //console.log("aftersha")
      } catch (error) {
        errors++
        console.log(error)
        return
      }
     
    })
   /*  console.log()
    console.log(errors)
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!") */
    //console.log("out of commits")

    // Remove the temporary directory
    del.sync([repoDir], { force: true });

    /*     // Prepare the final result as an array of frequencyPairing objects
    const result: frequencyPairing[] = [];
    counter.forEach((v, k) => {
        result.push({ x: k, y: v });
    }); */




        //make commit-functions to json
    /*     console.log(commits_to_functions);
    */ 
    /*
    ######   ######   #######  #        ###  #     #  ###  #     #     #     ###  ######   #     #      #######  #######  ######   #     #  #     #  #           #    
    #     #  #     #  #        #         #   ##   ##   #   ##    #    # #     #   #     #   #   #       #        #     #  #     #  ##   ##  #     #  #          # #   
    #     #  #     #  #        #         #   # # # #   #   # #   #   #   #    #   #     #    # #        #        #     #  #     #  # # # #  #     #  #         #   #  
    ######   ######   #####    #         #   #  #  #   #   #  #  #  #     #   #   ######      #         #####    #     #  ######   #  #  #  #     #  #        #     # 
    #        #   #    #        #         #   #     #   #   #   # #  #######   #   #   #       #         #        #     #  #   #    #     #  #     #  #        ####### 
    #        #    #   #        #         #   #     #   #   #    ##  #     #   #   #    #      #         #        #     #  #    #   #     #  #     #  #        #     # 
    #        #     #  #######  #######  ###  #     #  ###  #     #  #     #  ###  #     #     #         #        #######  #     #  #     #   #####   #######  #     # 
                                                                                                                                                                      
      
    (Freq + bugs) * age

    Age =  1 - 1/(Index of current commit + 1)
    Freq = nr of times in all commits
    Bugs = nr of bugfix commits           YET TO BE IMPLEMENTED


    for each instance of a change in the  repo it is worth 1 "point",
     if it also was a bugfix it is worth 5 points, 
     then the 1 or 5 is multiplied by 1/age where age is a fraction from 0 to 1 with 1 representing the newest commit
     and 0 the first commit,  the age is 1/index of age starting at 1  for the newest commit
     as such the final "point" calue is not valueable in itself but rather comparing its value to others in the same repo
     can be usefull.

    let age = 1/index ;
    let Freq = 1;
    let bug = 4;
    if (isBug(item)){
          freq += bug;
    }
    Freq*=age;
    funcname.set value += freq;
    */                                                                                                                                                               

    let itemsums = new Map<String, number>()
    let simplesums = new Map<String, number>()
    let json:{commits:any[]} = {commits:[]}
    let index = 1;
    
    commits_to_functions.forEach((items, sha)=>{
      index++
      let age = 1/index
      
      items.forEach((name)=>{

        let importance = 1
        if (isBug(name)){
          importance += 4
        }
        importance *= age;
        let prev_val = itemsums.get(name)
        if (prev_val){
          itemsums.set(name,  prev_val + importance)
          simplesums.set(name, simplesums.get(name)!+1)
        }
        else{
          simplesums.set(name, 1)
          itemsums.set(name, importance)
        }
        
      })
      
      //json.commits.push([sha, items])
    })

  /*   console.log(itemsums);
    console.log("----")
    console.log(simplesums); */
    return Object.fromEntries(itemsums) ;
  } catch (error) {
    console.error(error);
    return [];
  }
}

function isBug(name: string){
  //here we should either have an optional input that is the list of buggy commits

  return true
}

function getFunctionsFromDiff(diff: string, ret_funcs:string[]) {
  const regex = /function[ ]+[a-z0-9A-Z_]+\(+[a-z0-9A-Z_:, ]*\)|[A-Za-z0-9]+[ ]=[ ]+\([A-Za-z0-9: ]*\)[ ]*=>|[A-Za-z0-9]+[ ]=[ ]+async[ ]+\([A-Za-z0-9: ]*\)[ ]*=>/;
  
  const functions: (string | null)[] = diff.split('\n')
      .map(line => {
          const match = line.match(regex);
          return match ? match[0].split('(')[0].replace("function", "").replace(" ", "").replace("=>", "").replace(" async","").replace("= ","=").replace(": ",":").replace(") ",")").replace('=','') : null;
      })
      .filter(f => f);
      
  functions.forEach((item) => {
    ret_funcs.push(item!)
  })
}

function processDiff(diff: string) {
    // Use a regular expression to match function definitions written in either the "function" syntax
    // or the (named) "arrow" syntax, with or without the async keyword.
    const regex = /function[ ]+[a-z0-9A-Z_]+\(+[a-z0-9A-Z_:, ]*\)|[A-Za-z0-9]+[ ]=[ ]+\([A-Za-z0-9: ]*\)[ ]*=>|[A-Za-z0-9]+[ ]=[ ]+async[ ]+\([A-Za-z0-9: ]*\)[ ]*=>/;
    
    const functions: (string | null)[] = diff.split('\n')
        .map(line => {
            const match = line.match(regex);
            return match ? match[0].split('(')[0].replace("function", "").replace(" ", "").replace("=>", "").replace(" async","").replace("= ","=").replace(": ",":").replace(") ",")").replace('=','') : null;
        })
        .filter(f => f);

    // Update the counter for each extracted function name
    if( functions != null){
      return functions
    }
    return "SOMETHINGS WRONG"
}


