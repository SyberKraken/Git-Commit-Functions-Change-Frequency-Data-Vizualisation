// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import getGitLog from '../../jsscripts/gitlogtext'


type frequencyPairings =  {key:string, num:number}[]

type Data = {
  functionNames: frequencyPairings
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ functionNames: getGitLog("https://github.com/SyberKraken/Git-Commit-Functions-Change-Frequency-Data-Vizualisation")
})
}
