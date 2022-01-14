// api/users.js

import dbConnect from '../../lib/dbConnect'
import Clock from '../../models/Clock.js'

export default async function handler (req, res) {
      
  const { method } = req

  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        const clock = await Clock.find({})
        res.status(200).json({ success: true, data: clock })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    case 'POST':
      try {
        let date = new Date();
        let dateAdd = new Date();
        date.setDate(dateAdd.getDate() + 1)
        if(req.body.type === 'clockIn'){
            let newClock = {
                date: date,
                clockIn: date,
                clockOut: null,
                lunchIn: null,
                lunchOut: null,
                employee: req.body.id
            }
            const clock = await Clock.create(newClock)
            res.status(201).json({ success: true, data: clock })
        }
        if(req.body.type === 'clockOut'){
            let data = await Clock.findOneAndUpdate({
                date: {
                    $gte: date,
                    $lt: dateAdd
                },
                employee: req.body.id
            }, {$set: {clockOut: date}})
            res.status(201).json({ success: true, data: data})
        }
        if(req.body.type === 'lunchIn'){
            try{
                console.log('here')
            let data = await Clock.findOneAndUpdate({
                date: {
                    $gte: date,
                    $lt: dateAdd
                },
                employee: req.body.id
            }, {$set: {lunchIn: date}})
            res.status(201).json({ success: true, data: data})}
            catch(error){
                console.log(error)
            }
        }
        if(req.body.type === 'lunchOut'){
            let data = await Clock.findOneAndUpdate({
                date: {
                    $gte: date,
                    $lt: dateAdd
                },
                employee: req.body.id
            }, {$set: {lunchOut: date}})
            res.status(201).json({ success: true, data: data})
        }
      } catch (error) {
        console.log('failed here')
        console.log(error)
        res.status(400).json({ success: false })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}