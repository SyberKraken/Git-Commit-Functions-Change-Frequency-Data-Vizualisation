import Head from 'next/head'
import Image from 'next/image'
import Menu from '../components/menu'
import File_treemap from '../components/File_treemap'
import styles from '../styles/Home.module.css'




function logTest(){
  
  let y =2
  let z =3
}


export default function Home() {
 

  

  return (
    <>
    <Menu></Menu>
    <div>
       <File_treemap></File_treemap>
    </div>
    </>
  )
}



