// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import getGitLog from '../../jsscripts/gitlogtext'


type frequencyPairings =  {x:string, y:number}[]

//the query parameter "repo" is used to fech data from a git repository ex: 
///api/remote_branch_fetch?repo=https://github.com/SyberKraken/Git-Commit-Functions-Change-Frequency-Data-Vizualisation
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //console.log(req.query)
  const repo = req.query.repo?.toString()!
  res.status(200).json(getGitLog(repo))
}
