const mongoose = require('mongoose')
const { Schema } = mongoose

const ParkingResultSchema = new Schema({
  name_tc: String,
  name_en: String,
  latitude: String,
  longitude: String,
  display_address: String,
  district: String,
  park_id: String,
  space: Number
}, {
    timestamps: true
})

module.exports = mongoose.model('ParkingResult', ParkingResultSchema)

