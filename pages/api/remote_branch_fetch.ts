// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import getGitLog from '../../jsscripts/gitlogtext'


type frequencyPairings =  {x:string, y:number}[]

const repo : string = "https://github.com/SyberKraken/Git-Commit-Functions-Change-Frequency-Data-Vizualisation"


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json(getGitLog(repo))
}
