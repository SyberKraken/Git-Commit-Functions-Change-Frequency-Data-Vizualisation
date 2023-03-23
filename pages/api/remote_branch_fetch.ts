// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import getGitLog from '../../jsscripts/gitlogtext'

//the query parameter "repo" is used to fech data from a git repository ex: 
///api/remote_branch_fetch?repo=https://github.com/SyberKraken/Git-Commit-Functions-Change-Frequency-Data-Vizualisation

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  ////console.log(cached_data)
  ////console.log(req.query)
  const getQuery = (name:string):any => {return req.query[name]?.toString()!};
  let x = getGitLog(
    getQuery("repo"),
    getQuery("Frequency"),
    getQuery("Age"),
    getQuery("BugFixList"),
    getQuery("bugList")
  )
  res.status(200).json(x
                      )
 
}
