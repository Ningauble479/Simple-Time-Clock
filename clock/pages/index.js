import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import Link from 'next/link'
export default function Home() {
  let [name, setName] = useState('')
  let [users, setUsers] = useState('')
  let sendData = async (e, type, id) => {
    e.preventDefault()

    if(name === 'none' || !name){return alert('Please Select Your Name')}
    let user = users.find(item => item.name === name)
    console.log(user)
    let {data} = await axios.post('http://localhost:3000/api/clock', {type: type, id: user.id})
    console.log(data)
  }

  let addUser = async () => {
    axios.post('http://localhost:3000/api/users', {name: 'devon', email: 'devonvowen@gmail.com'})
  }

  let getUsers = async () => {
    let {data} = await axios.get('http://localhost:3000/api/users')
    console.log(data.data)
    setUsers(data.data)
    setName(data.data[0].name)
  }

  useEffect(async ()=>{
    getUsers()
  },[])  

  return (
    <div style={{height: '400vh'}} className={styles.container}>
      <div style={{position: 'fixed', top: '15px', right: '20px'}}><Link href='/admin'><button>Admin Panel</button></Link></div>
      <h1 style={{maxWidth: '100vw', textAlign: 'center'}}>Great Woods Time Clock</h1>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh'}}>
        <form style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'space-around', minHeight: '50%'}}>
          <label>
            Name:
            <select value={!users ? 'loading' : users[0].name} style={{marginBottom: '15px', width: '100%', height: '50px'}} onChange={(e)=>setName(e.target.value)}>
              {!users ? <option>loading</option> : users.map((row)=>{
                return <option style={{minHeight:'50px'}}>{row.name}</option>
              })}
            </select>
          </label>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px'}}>
          <button onClick={(e)=>{sendData(e, 'clockIn')}} style={{width: '100px', height: '100px', background: 'white', border: '1px solid black', marginRight: '50px' }}>Clock In</button>
          <button onClick={(e)=>{sendData(e, 'lunchIn')}} style={{width: '100px', height: '100px', background: 'white', border: '1px solid black', marginRight: '50px' }}>Lunch In</button>
          <button onClick={(e)=>{sendData(e, 'lunchOut')}} style={{width: '100px', height: '100px', background: 'white', border: '1px solid black', marginRight: '50px' }}>Lunch Out</button>
          <button onClick={(e)=>{sendData(e, 'clockOut')}} style={{width: '100px', height: '100px', background: 'white', border: '1px solid black' }}>Clock Out</button>
          </div>
        </form>
      </div>
    </div>
  )
}
