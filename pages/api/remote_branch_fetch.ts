// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import getGitLog from '../../jsscripts/gitlogtext'

//the query parameter "repo" is used to fech data from a git repository ex: 
///api/remote_branch_fetch?repo=https://github.com/SyberKraken/Git-Commit-Functions-Change-Frequency-Data-Vizualisation
export let cached_data = new Map<string, any>()

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  ////console.log(cached_data)
  ////console.log(req.query)
  const repo = req.query.repo?.toString()!
  if (cached_data.has(repo)){
    res.status(200).json(cached_data.get(repo))
  }
  else{
    cached_data.set(repo, getGitLog(repo))
    res.status(200).json(cached_data.get(repo))
  }
 
}
