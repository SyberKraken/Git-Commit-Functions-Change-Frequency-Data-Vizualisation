This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```
This repo vizualises its own java/typescript functions change frequency in git commits with a treemap via nextjs 

Open [http://localhost:3000](http://localhost:3000) with your browser to see a treemap generated from
the result.json file in gitscripts.

If you want to you can manualy change this file to see changes,
 or you can generate the json data form generateDiffFiles.py
## OBS the pythonscipt generateDiffFiles.py only works on windows machines for now

make some local commits with new  functions or change existing functions and then run the script 
then you can see how the vizualisation changes with changes in functions

currentley working on making this able to vizualise other git repos than itself
as well as a check for OS version to be able to run on Linux 
