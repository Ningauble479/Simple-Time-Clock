import mongoose from 'mongoose'

const ClockSchema = new mongoose.Schema({
    date: Date,
    clockIn: Date,
    clockOut: Date,
    lunchIn: Date,
    lunchOut: Date,
    employee: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
})

module.exports = mongoose.models.Clock || mongoose.model('Clock', ClockSchema)