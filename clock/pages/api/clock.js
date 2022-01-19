// api/users.js

import dbConnect from '../../lib/dbConnect'
import Clock from '../../models/Clock.js'

async function checkDB(id, type){
  var start = new Date();
  start.setHours(0, 0, 0, 0);

  var end = new Date();
  end.setHours(23, 59, 59, 999);

  let check = await Clock.findOne({
    date: {
      $gte: start,
      $lt: end
    },
    employee: id
  })
  console.log(check)
  if(type === 'lunchIn'){
    if(check.lunchIn != false && check.lunchIn != null){
      return true
    }
    return false
  }
  if(type === 'lunchOut'){
    if(check.lunchOut != false && check.lunchOut != null){
      return true
    }
    return false
  }
  if(type === 'clockOut'){
    if(check.clockOut != false && check.clockOut != null){
      return true
    }
    return false
  }
}

export default async function handler(req, res) {

  const { method } = req
  var start = new Date();
  start.setHours(0, 0, 0, 0);

  var end = new Date();
  end.setHours(23, 59, 59, 999);
  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        const clock = await Clock.findOne({
          date: {
            $gte: start,
            $lt: end
          },
          employee: req.body.id
        })
        res.status(200).json({ success: true, data: clock })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    case 'POST':
      try {
        let date = new Date();
        if (req.body.type === 'clockIn') {
          let check = await Clock.findOne({
            date: {
              $gte: start,
              $lt: end
            },
            employee: req.body.id
          })
          if(check){
            return res.status(500).json({status: 'Failed', error: `User ${req.body.id} already clocked in.`})
          }
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
        if (req.body.type === 'clockOut') {
          let test = await checkDB(req.body.id, req.body.type) 
          if(test) return res.status(500).json({success: false, msg: 'You already clocked Out.'})
          console.log('found')
          let data = await Clock.findOneAndUpdate({
            date: {
              $gte: start,
              $lt: end
            },
            employee: req.body.id
          }, { $set: { clockOut: date } },
          {new: true})
          console.log(start)
          console.log(end)
          console.log(date)
          res.status(201).json({ success: true, data: data })
        }
        if (req.body.type === 'lunchIn') {
          let test = await checkDB(req.body.id, req.body.type) 
          if(test) return res.status(500).json({success: false, msg: 'You already clocked In for lunch.'})
          try {
            console.log('here') 
            let data = await Clock.findOneAndUpdate({
              date: {
                $gte: start,
                $lt: end
              },
              employee: req.body.id
            }, { $set: { lunchIn: date } },
            {new: true})
            res.status(201).json({ success: true, data: data })
          }
          catch (error) {
            console.log(error)
          }
        }
        if (req.body.type === 'lunchOut') {
          let test = await checkDB(req.body.id, req.body.type) 
          if(test) return res.status(500).json({success: false, msg: 'You already clocked Out for lunch.'})
          let data = await Clock.findOneAndUpdate({
            date: {
              $gte: start,
              $lt: end
            },
            employee: req.body.id
          }, { $set: { lunchOut: date } },
          {new: true})
          res.status(201).json({ success: true, data: data })
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