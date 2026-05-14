require('dotenv').config()
const express = require('express')
const postRoute = require('./routes/post.route.js') 
const connectDB = require('./config/db.js')

const app = express()
app.use(express.json())

connectDB()  


app.use('/posts', postRoute)

const PORT = 3000

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})