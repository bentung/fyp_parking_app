const express = require('express')

const app = express()

require('dotenv').config()

app.use(express.json())

const connectDB = require('./connectMongo')

connectDB()

const ParkingResultModel = require('./models/ParkingResult.model')

app.get('/api/v1/parkingResult', async (req, res) => {

    const { limit = 5, orderBy = 'name', sortBy = 'asc', keyword } = req.query
    let page = +req.query?.page

    if (!page || page <= 0) page = 1

    const skip = (page - 1) * +limit

    const query = {}

    const projection = { updatedAt: 0 };

    if (keyword) query.name = { "$regex": keyword, "$options": "i" }

    try {
        // const data = await ParkingResultModel.find(query).skip(skip).limit(limit).sort({[orderBy]: sortBy})
        const data = await ParkingResultModel.find(query, projection);
        const totalItems = await ParkingResultModel.countDocuments(query)
        return res.status(200).json({
            msg: 'Ok',
            data,
            // totalItems,
            // totalPages: Math.ceil(totalItems / limit),
            // limit: +limit,
            // currentPage: page
        })
    } catch (error) {
        return res.status(500).json({
            msg: error.message
        })
    }
})

app.get('/api/v1/parkingResult/:id', async (req, res) => {
    try {
        const data = await ParkingResultModel.findById(req.params.id)

        if (data) {
            return res.status(200).json({
                msg: 'Ok',
                data
            })
        }

        return res.status(404).json({
            msg: 'Not Found',
        })
    } catch (error) {
        return res.status(500).json({
            msg: error.message
        })
    }
})

app.post('/api/v1/parkingResult', async (req, res) => {
    try {
        // const { name, author, price, description } = req.body

        // const parking = new ParkingResultModel({
        //     name, author, price, description
        // })
        const parking = new ParkingResultModel({
            ...req.body,
        });
        const data = await parking.save()
        return res.status(200).json({
            msg: 'Ok',
            data
        })
    } catch (error) {
        return res.status(500).json({
            msg: error.message
        })
    }
})

app.put('/api/v1/parkingResult/:id', async (req, res) => {
    try {
        const { name, author, price, description } = req.body
        const { id } = req.params

        const data = await ParkingResultModel.findByIdAndUpdate(id, {
            name, author, price, description
        }, { new: true })

        return res.status(200).json({
            msg: 'Ok',
            data
        })
    } catch (error) {
        return res.status(500).json({
            msg: error.message
        })
    }
})

app.delete('/api/v1/parkingResult/:id', async (req, res) => {
    try {
        await ParkingResultModel.findByIdAndDelete(req.params.id)
        return res.status(200).json({
            msg: 'Ok',
        })
    } catch (error) {
        return res.status(500).json({
            msg: error.message
        })
    }
})

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT)
})