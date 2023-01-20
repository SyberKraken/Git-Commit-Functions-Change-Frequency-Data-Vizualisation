This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

https://user-images.githubusercontent.com/26491010/213805452-85e24c33-d649-43a0-9d90-ab43bf0df65b.mov

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```
This repo vizualises the amount of changes to its own or other git repos javascript/typescript functions 
with a treemap via nextjs







Open [http://localhost:3000](http://localhost:3000) with your browser, type an adress in the 
input bar and click "update chart" to see a treemap of the amount of changes made to a function
since its creation. you can also directley input your repos adress as a get parameter
ex:/?adress=https://github.com/xxxx/repo 
wich will directley load your repos data.
This does clone and remove the repo in your temp files.

## TODO

make treemap of %bugfixes from some form of input of what is considered bugfix commits, Maybe list of commits, maybe some specific phrase in the names of the commits, or more likeley, make it so we return the list of commits, then we can either put in a subset of them or click them or something.

make parser capable of more langueges than TS and JS, (python, C, Java, GO, Rust, Ruby)

make prettier site
