import Head from 'next/head'
import Image from 'next/image'
import Menu from '../components/Menu'
import File_treemap from '../components/File_treemap'
import styles from '../styles/Home.module.css'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'




function logTest(){
  
  let y =2
  let z =3
  "addedfor1bugfixchagetest"
}

let arrowtest = (test: any) => {
  test
  "addedfor1bugfixchagetest"
}

let asyncarrowtest = async (test: any) => {
  test
  "addedfor1bugfixchagetest"
}

export default function Home() {
  const apiAdress = "http://localhost:3000/api/remote_branch_fetch?repo="
  let [gitRemote, setGitRemote] = useState(''/*"https://github.com/SyberKraken/Git-Commit-Functions-Change-Frequency-Data-Vizualisation"*/)
  let [newAdress, setNewAdress] = useState('')

  const newRemote = (event: React.ChangeEvent<HTMLInputElement>) =>{
    setGitRemote(event.target.value)
  }
  
  
   const router = useRouter()

 
  if(router.query.adress && newAdress !== apiAdress + router.query.adress?.toString()){
    setNewAdress(apiAdress + router.query.adress?.toString())
  } 


  return (
    <>
    <Menu></Menu>
    <div className='fullwidthParent'>
      <input className='repoAdressInput' placeholder="input your repos adress here" type="text" value={gitRemote} onChange={newRemote} />
      <Link className='newAdressButton' href={"http://localhost:3000/?adress=" + gitRemote}>Update Chart</Link>
      
    </div>
    <div className='fullwidthParent'>
      <File_treemap remote={newAdress}></File_treemap>
    </div>
    </>
  )
}



