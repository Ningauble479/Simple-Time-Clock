import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'

export default function Home() {
  let [name, setName] = useState('')
  let [users, setUsers] = useState('')
  let [alert, setAlert] = useState('')
  let [alertMessage, setAlertMessage] = useState('')
  let [currentClock, setCurrentClock] = useState({
    clockIn: false,
    lunchIn: false,
    lunchOut: false,
    clockOut: false
  })
  let sendData = async (e, type, id) => {
    e.preventDefault()
    e.stopPropagation()

    if (name === 'none' || !name) { return alert('Please Select Your Name') }
    let user = users.find(item => item.name === name)
    let { data } = await axios.post('http://localhost:3000/api/clock', { type: type, id: user._id })
    if (data.success === true) {
      console.log(data)
      setCurrentClock(data.data)
      setAlert('success')
      setAlertMessage('You have successfully clocked in.')
      setTimeout(() => {
        setAlert('')
        setAlertMessage('')
      }, 5000)
    }
    console.log(data)
    if(data.success === false){
      console.log(data.msg)
      setAlert('failed')
      setAlertMessage(data.msg)
      setTimeout(() => {
        setAlert('')
        setAlertMessage('')
      }, 5000)
    }
  }

  let addUser = async () => {
    axios.post('http://localhost:3000/api/users', { name: 'devon', email: 'devonvowen@gmail.com' })
  }

  let getUsers = async () => {
    let { data } = await axios.get('http://localhost:3000/api/users')
    let data2 = await axios.post('http://localhost:3000/api/getToday', { id: data.data[0]._id })
    let clock = data2.data.data
    if(clock){setCurrentClock(clock)}
    setUsers(data.data)
    setName(data.data[0].name)
  }

  let handleChange = async (e) => {
    setName(e.target.value)
    console.log(e.target.value)
    let user = users.find(item => item.name === e.target.value)
    let { data } = await axios.post('http://localhost:3000/api/getToday', { id: user })
    console.log(data.data)
    if(data.data === null){
     return setCurrentClock({
        clockIn: false,
        lunchIn: false,
        lunchOut: false,
        clockOut: false
      })
    }
    setCurrentClock(data.data)
  }

  let dateClean = (date) => {
    if(date ===  false || date === null)return 'Not Clocked'
    let parsedDate = parseISO(date)
    let fixedDate = format(parsedDate, 'h:mm b')
    return fixedDate
  }

  useEffect(async () => {
    getUsers()
  }, [])

  return (
    <div style={{ height: '400vh' }} className={styles.container}>
      <div className='alertContainer'>
        <div className={alert === '' ? 'hidden' : `alert ${alert}`}>
          {alertMessage}
        </div>
      </div>
      <div style={{ position: 'fixed', top: '15px', right: '20px' }}><Link href='/admin'><button>Admin Panel</button></Link></div>
      <h1 style={{ maxWidth: '100vw', textAlign: 'center' }}>Great Woods Time Clock</h1>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', minHeight: '70vh' }}>
        <form style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'space-around', minHeight: '50%' }}>
          <label>
            Name:
            <select value={name ? name 
              : users ? users[0].name
              : 'loading...'} style={{ marginBottom: '15px', width: '100%', height: '50px' }} onChange={(e) => handleChange(e)}>
              {!users ? <option>loading</option> : users.map((row) => {
                return <option style={{ minHeight: '50px' }}>{row.name}</option>
              })}
            </select>
          </label>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '40vw', paddingTop: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <button onClick={(e) => { sendData(e, 'clockIn') }} style={
                currentClock.clockIn != false && currentClock.clockIn != null ? { width: '100px', height: '100px', background: 'green', border: '1px solid black' } : { width: '100px', height: '100px', background: 'white', border: '1px solid black' }}
              >Clock In</button>
              <div style={{ textAlign: 'center' }}>{dateClean(currentClock.clockIn)}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <button onClick={(e) => { sendData(e, 'lunchOut') }} style={
              currentClock.lunchOut != false && currentClock.lunchOut != null ? { width: '100px', height: '100px', background: 'green', border: '1px solid black' } : { width: '100px', height: '100px', background: 'white', border: '1px solid black' }}
            >Lunch Out</button>
            <div style={{ textAlign: 'center' }}>{dateClean(currentClock.lunchOut)}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <button onClick={(e) => { sendData(e, 'lunchIn') }} style={
              currentClock.lunchIn != false && currentClock.lunchIn != null ? { width: '100px', height: '100px', background: 'green', border: '1px solid black' } : { width: '100px', height: '100px', background: 'white', border: '1px solid black' }}
            >Lunch In</button>
            <div style={{ textAlign: 'center' }}>{dateClean(currentClock.lunchIn)}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <button onClick={(e) => { sendData(e, 'clockOut') }} style={
              currentClock.clockOut != false && currentClock.clockOut != null ? { width: '100px', height: '100px', background: 'green', border: '1px solid black' } : { width: '100px', height: '100px', background: 'white', border: '1px solid black' }}
            >Clock Out</button>
            <div style={{ textAlign: 'center' }}>{dateClean(currentClock.clockOut)}</div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
