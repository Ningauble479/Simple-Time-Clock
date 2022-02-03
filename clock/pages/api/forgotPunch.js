// api/users.js

import dbConnect from '../../lib/dbConnect'
import ForgottenPunch from '../../models/forgottenPunch.js'

export default async function handler(req, res) {

  const { method } = req
  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        const forgottenPunch = await ForgottenPunch.find().populate('employee')
        res.status(200).json({ success: true, data: forgottenPunch })
      } catch (error) {
          console.log(error)
        res.status(400).json({ success: false })
      }
      break
    case 'POST':
      try {
        let forgottenPunch = {
            day: new Date(),
            employee: req.body.id,
            punch: req.body.punch,
            reason: req.body.reason,
            fixedTime : req.body.fixedTime,
            fixed: false
        }
        let data = await ForgottenPunch.create(forgottenPunch)
        res.status(201).json({ success: true, data: data })
      } catch (error) {
          console.log('here')
        console.log(error)
        res.status(400).json({ success: false, err: error })
      }
      break
    default:
        console.log('what')
      res.status(400).json({ success: false, error: 'what' })
      break
  }
}