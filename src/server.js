require('dotenv').config()
const express = require('express')
const postRoute = require('./routes/post.route.js') 
const connectDB = require('./config/db.js')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

connectDB()  


app.use('/posts', postRoute)


app.get('/health', (req,res) => {
    res.status(200).json({message: "OK", timestamp: Date.now()})
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})