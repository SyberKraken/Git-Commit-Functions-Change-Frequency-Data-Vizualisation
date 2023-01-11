import { execSync } from 'child_process';
import { tmpdir, type } from 'os';
import { join } from 'path';
//npm install --save-dev @types/node      install fs-extra type
import del from 'del';
import { count } from 'console';

type frequencyPairings =  {x:string, y:number}[]


function getGitLog(repoUrl: string): frequencyPairings {
  try {
    // Create a temporary directory to clone the repository into
    const tempDir = tmpdir();
    const repoDir = join(tempDir, 'repo');

    // Clone the repository
    execSync(`git clone ${repoUrl} ${repoDir}`);

    // Run the git log command in the repository directory
    // realised github does not support notes, so kinda have to scrap that idea, trying something different
    const log = execSync(`git --git-dir=${repoDir}/.git --work-tree=${repoDir} log -p`).toString();
    console.log(log.includes("Notes:"))
    // Remove the temporary directory
    del.sync([repoDir], { force: true });

    return functionhunter(log.split("\n"));
  } catch (error) {
    console.error(error);
    return [];
  }
}



let functionhunter = (lines:string[]):frequencyPairings => {
    // This code uses a regular expression to match function definitions 
    // written in either the "function" syntax or the (named)"arrow" syntax, with or
    // without the async keyword.
  
    const regex = /function[ ]+[a-z0-9A-Z_]+\(+[a-z0-9A-Z_:, ]*\)|[A-Za-z0-9]+[ ]=[ ]+\([A-Za-z0-9: ]*\)[ ]*=>|[A-Za-z0-9]+[ ]=[ ]+async[ ]+\([A-Za-z0-9: ]*\)[ ]*=>/;
        
        const functions = lines.map(line => {
          const match = line.match(regex);
          return match ? match[0].replace("function", "").replace(" ", "").replace("=>", "").replace(" async","").replace("= ","=").replace(": ",":").replace(") ",")")   : null;
        });

        //filter out null values for TS safetey 
        //this should be done with filter but TS does not recognize that as type safe 
        const typeSafeFunctions: string[] = [];
        functions.forEach(f => {
        if (f) {
            typeSafeFunctions.push(f);
        }
        });
        if (!typeSafeFunctions.length) {
            throw new Error("No functions found!");
        }

        // TODO : make 

        // TODO : break this out to own function
        const counter: Map<string, number> = new Map<string, number>
        for (const str of typeSafeFunctions) {
            if (counter.has(str)) {
                const n = counter.get(str)!+1
                counter.set(str,n) ;
              } else {
                counter.set(str, 1);
              }
        }
        const retlist: frequencyPairings = []
        counter.forEach((v, k)=>{retlist.push({x:k,y:v})})

   


        return retlist
        
    }






export default getGitLog
