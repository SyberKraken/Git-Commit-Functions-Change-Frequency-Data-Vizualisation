This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```
This repo vizualises the amount of changes to its own or other git repos javascript/typescript functions 
with a treemap via nextjs

![alt text](https://github.com/SyberKraken/Git-Commit-Functions-Change-Frequency-Data-Vizualisation/blob/main/imgs/example.png)

Open [http://localhost:3000](http://localhost:3000) with your browser, type an adress in the 
input bar and click "update chart" to see a treemap of the amount of changes made to a function
since its creation. you can also directley input your repos adress as a get parameter
ex:/?adress=https://github.com/xxxx/repo 
wich will directley load your repos data.
This does clone and remove the repo in your temp files.

## TODO

remove old python code

make treemap of %bugfixes from some form of input of what is considered bugfix commits, Maybe list of commits, maybe some specific phrase in the names of the commits.

make parser capable of more langueges than TS and JS, (python, C, Java, GO, Rust, Ruby)

make prettier site
