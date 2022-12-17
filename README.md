This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```
This repo vizualises its own or other git repos java/typescript functions precentage of commited changes wich are bugfixes compared
with a treemap via nextjs, specificly commits with "bugfix" in its notes

Open [http://localhost:3000](http://localhost:3000) with your browser to see a treemap generated from
the result.json file in gitscripts.

If you want to you can manualy change this file to see changes,
 or you can generate the json data from generateDiffFiles.py

 generateDiffFiles.py can also generate changes from any other local repo
at the moment you need to change the "other_repo_path" variable to
the directory of your git repo

OBS the pythonscipt generateDiffFiles.py only works on windows machines for now

make some local commits with new  functions or change existing functions and then run the script 
then you can see how the vizualisation changes with changes in functions

currentley working on making single file with inputs to generate backend data
as well as a check for OS version to be able to run on Linux 
