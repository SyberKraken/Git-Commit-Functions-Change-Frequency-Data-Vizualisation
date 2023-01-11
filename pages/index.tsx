import Head from 'next/head'
import Image from 'next/image'
import Menu from '../components/Menu'
import File_treemap from '../components/File_treemap'
import styles from '../styles/Home.module.css'




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
  return (
    <>
    <Menu></Menu>
    <div>
       <File_treemap remote="http://localhost:3000/api/remote_branch_fetch"></File_treemap>
    </div>
    </>
  )
}



