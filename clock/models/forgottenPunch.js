import mongoose from 'mongoose'

const ForgottenPunchSchema = new mongoose.Schema({
    employee: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    day: Date,
    punch: String,
    reason: String,
    fixedTime: String,
    fixed: Boolean
})

module.exports = mongoose.models.ForgottenPunch || mongoose.model('ForgottenPunch', ForgottenPunchSchema)