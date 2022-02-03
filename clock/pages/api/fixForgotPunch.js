import ForgottonPunch from '../../models/forgottenPunch'



export default async function handler (req,res) {

    try{
        console.log(req.body.id)
        const forgottenPunch = await ForgottonPunch.findOneAndUpdate({_id: req.body.id}, {fixed: true})
        res.json({success: true, data: forgottenPunch})
    }
    catch(err){
        console.log(err)
        return res.json({success: false, err: err})
    }

}