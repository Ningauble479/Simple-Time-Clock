import axios from 'axios'
import { useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import {format, parse, parseISO} from 'date-fns'
import Link from 'next/link'

export default function adminMain(){
    let [users, setUsers] = useState('')
    let [addedUser, setAddedUser] = useState('')
    let [dateState, setDate] = useState('')
    let [selectedUser, setSelectedUser] = useState('')
    let [clockDays, setClockDays] = useState('')
    let [passBox , setPassBox] = useState(true)
    let [passWord, setPassword] = useState('')
    let getUsers = async () => {
        let {data} = await axios.get('http://localhost:3000/api/users')
        setSelectedUser(data.data[0].name)
        setUsers(data.data)
    }

    let onChange = async (date) => {
        setDate(date)
        getClocks(date)
    }

    let dateClean = date => {
        console.log(date)
        if(!date) return null
        let fixed = format(date, 'MMM Do y')
        console.log(fixed)
        return fixed
    }

    let dateCleanISO = (date, type) => {
        if(!date || date === null) {
            console.log('returned null')
            return null}
        let fixed = format(parseISO(date), `${type === 'dayyear' ? 'MMM Do y' : 'h:mm b'}`)
        console.log(fixed)
        return fixed
    }

    let selectUser = (e) => {

        setSelectedUser(e.target.value)
        setDate(null)
        setClockDays(null)
    }

    let getClocks = async (date) => {
        let user = users.find(item => item.name === selectedUser)
        let {data} = await axios.post('http://localhost:3000/api/getRange', {start: date[0], end: date[1], id: user._id})
        console.log(data.data)
        if(Array.isArray(data.data)){
        return setClockDays(data.data)
        }
        setClockDays([data.data])
    }

    let addUser = async () => {
        if(addedUser === '')return alert('Please Enter A Name')
        let {data} = await axios.post('http://localhost:3000/api/users', {name: addedUser, email: null})
        if(data.success === true){
            setUsers([...users, data.data])
            setAddedUser('')
        }
        if(data.success === false){
            alert('Something went wrong')
        }
    }

    let askForPass = (e) => {
        console.log(e)
        if(!e)return null
        if(e._reactName !== 'onClick'){
        if(e.code !== 'Enter'){return null}
    }

        let realPass = '2022'
        if(passWord === realPass){
            return setPassBox(false)
        }
        alert('Wrong Password Try Again')
    }

    useEffect(()=>{
        getUsers()
    },[])
    return(
        <div style={{height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <div className={passBox ? 'passBoxContainer' : 'hidden'}>
                <div tabIndex={'1'} onKeyDown={(e)=>{askForPass(e)}} className={passBox ? 'passBox' : 'hidden'}>
                    <label>
                        Please Provide Admin Password
                    <input onChange={(e)=>{setPassword(e.target.value)}}/>
                    </label>
                    <button onClick={(e)=>{askForPass(e)}}>Ok</button>

                </div>
            </div>
            <Link href='/'><h1>Admin Panel</h1></Link>
            <div style={{width: '100vw', height: '90vh', display: 'flex'}}>
                <div style={{width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <h1>Add Worker</h1>
                    <label>
                        Name: 
                    <input value={addedUser} style={{marginLeft: '15px'}} onChange={(e)=>{setAddedUser(e.target.value)}}/>
                    <button onClick={()=>{addUser()}}>Add</button>
                    </label>
                    <div>
                        {!users ? <p>Loading...</p> : users.map((row)=>{
                            return <p>{row.name}</p>
                        })}
                    </div>
                </div>
                <div style={{width: '50%', display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                    <h1>View Clocks</h1>
                    <select onChange={(e)=>{selectUser(e)}} style={{width: '50%', marginBottom: '50px'}}>
                        {!users ? <option>Loading...</option> : users.map((row)=>{
                            return <option>{row.name}</option>
                        })}
                    </select>
                    <div style={{maxWidth:'80%'}}>
                        <Calendar
                            onChange={onChange}
                            value={dateState}
                            selectRange={true}/>
                    </div>
                    <p>Selected Dates</p>
                    <div style={{display: 'flex'}}>
                        <p style={{marginRight: '5px'}}>{!dateState ? null : `${dateClean(dateState[0])} -`}</p>
                        <p>{!dateState ? null : ` ${dateClean(dateState[1])}`}</p>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <table style={{border: '1px solid black', minWidth: '40vw'}}>
                            <thead>
                                <tr>
                                        <th>Date</th>
                                        <th>Clock In</th>
                                        <th>Lunch Out</th>
                                        <th>Lunch In</th>
                                        <th>Clock Out</th>
                                </tr>
                            </thead>
                            <tbody>
                            {!clockDays ? null : !clockDays[0]?.date ? null : clockDays.map((row)=>{
                            return (
                                <tr style={{borderBottom: '1px solid black'}}>
                                    <td style={{textAlign: 'center'}}>{`${dateCleanISO(row.date, 'dayyear')}`}</td>
                                    <td style={{textAlign: 'center'}}>{`${dateCleanISO(row.clockIn)}`}</td>
                                    
                                    <td style={{textAlign: 'center'}}>{`${dateCleanISO(row.lunchOut)}`}</td>
                                    <td style={{textAlign: 'center'}}>{`${dateCleanISO(row.lunchIn)}`}</td>
                                    <td style={{textAlign: 'center'}}>{`${dateCleanISO(row.clockOut)}`}</td>
                                </tr>
                            )
                        })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}