// api/users.js

import dbConnect from '../../lib/dbConnect'
import Clock from '../../models/Clock.js'

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
            $gte: req.body.start,
            $lt: req.body.end
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
        const clock = await Clock.find({
            date: {
                $gte: req.body.start,
                $lt: req.body.end
            },
            employee: req.body.id
          })
          return res.status(200).json({success: true, data: clock})
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