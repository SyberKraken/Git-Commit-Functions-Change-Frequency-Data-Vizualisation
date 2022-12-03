// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const fs = require('fs')
type Data = {
  name: string
}

let mydata = [
    {x:"a", y:4},
    {x:"av", y:4},
    {x:"ssd", y:3},
    {x:"gdfs", y:34},
    {x:"dhgh", y:250},
    {x:"vweh", y:67},
    {x:"vsd", y:89},
    {x:"zweh", y:77},
    {x:"z", y:90},
    {x:"g", y:90},
    {x:"wweh", y:24},
    {x:"hhhhw", y:22},
]



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    fs.readFile('./gitscripts/result.json', 'utf-8', (err: any, jsonString: any) => {
        if (err) {
            console.log("File read failed:", err)
        }
        
        res.status(200).json(JSON.parse(jsonString))
    })
    
}

 