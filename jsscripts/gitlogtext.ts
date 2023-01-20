import { execSync } from 'child_process';
import { tmpdir, type } from 'os';
import { join } from 'path';
import del from 'del';

type frequencyPairing = { x: string, y: number };

export default function getGitLog(repoUrl: string): frequencyPairing[] {
  try {
    // Create a temporary directory to clone the repository into
    const tempDir = tmpdir();
    const repoDir = join(tempDir, 'repo' + Math.floor(Math.random()*9999).toString());

    // Clone the repository
    execSync(`git clone ${repoUrl} ${repoDir}`);

    // Initialize a counter to keep track of the function names and their frequencies
    const counter = new Map<string, number>();

    // Run the git diff command to get the SHA of the initial commit
    let all_sha = execSync(`git --git-dir=${repoDir}/.git --work-tree=${repoDir} rev-list HEAD`).toString().trim();
    let sha_list = all_sha.split("\n")

    console.log(sha_list)
    // Loop through the git diffs and process each one
    sha_list.forEach ( (sha) =>{
        console.log(sha)
        // Run the git diff command for the current commit
        const diff = execSync(`git --git-dir=${repoDir}/.git --work-tree=${repoDir} diff ${sha}`).toString();
        
        // Process the diff to extract the function names
        processDiff(diff, counter);
        // Get the SHA of the parent commit for the next iteration
        sha = execSync(`git --git-dir=${repoDir}/.git --work-tree=${repoDir} rev-list ${sha}^ --max-count=1`).toString().trim();
    })
    console.log("out of commits")
    // Remove the temporary directory
    del.sync([repoDir], { force: true });

    // Prepare the final result as an array of frequencyPairing objects
    const result: frequencyPairing[] = [];
    counter.forEach((v, k) => {
        result.push({ x: k, y: v });
    });
    return result;
  } catch (error) {
    console.error(error);
    return [];
  }
}

function processDiff(diff: string, counter: Map<string, number>) {
    // Use a regular expression to match function definitions written in either the "function" syntax
    // or the (named) "arrow" syntax, with or without the async keyword.
    const regex = /function[ ]+[a-z0-9A-Z_]+\(+[a-z0-9A-Z_:, ]*\)|[A-Za-z0-9]+[ ]=[ ]+\([A-Za-z0-9: ]*\)[ ]*=>|[A-Za-z0-9]+[ ]=[ ]+async[ ]+\([A-Za-z0-9: ]*\)[ ]*=>/;

    const functions = diff.split('\n')
        .map(line => {
            const match = line.match(regex);
            return match ? match[0].split('(')[0].replace("function", "").replace(" ", "").replace("=>", "").replace(" async","").replace("= ","=").replace(": ",":").replace(") ",")").replace('=','') : null;
        })
        .filter(f => f);

    // Update the counter for each extracted function name
    for (const str of functions) {
        if (counter.has(str!)) {
            counter.set(str!, counter.get(str!)! + 1);
        } else {
            counter.set(str!, 1);
        }
    }
}