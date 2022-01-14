// api/users.js

import dbConnect from '../../lib/dbConnect'
import User from '../../models/Users.js'

export default async function handler (req, res) {

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
      
  const { method } = req

  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        const users = await User.find({})
        res.status(200).json({ success: true, data: users })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    case 'POST':
      try {
          console.log('got here')
        let newUser = {
            name: capitalizeFirstLetter(req.body.name),
            email: req.body.email
        }
        const user = await User.create(newUser)
        res.status(201).json({ success: true, data: user })
      } catch (error) {
        console.log('failed here')
        res.status(400).json({ success: false })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}