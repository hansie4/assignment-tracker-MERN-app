const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const accountRoute = require('./routes/accounts')

/* ----------------------------------DEV---------------------------------- */
// Load Environmental Variables
const environmentalVars = dotenv.config({ path: './configs.env' })
if (environmentalVars.error) {
    throw environmentalVars.error
} else {
    console.log('Environmental Variables Loaded')
}

// Start Application
const app = express()

// Use JSON Middleware
app.use(express.json())

// Use Routes
app.use('/account', accountRoute)

// Connect to Database
mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to MongoDB Database')

        app.listen(process.env.PORT, () => {
            console.log(`Assignment Tracker backend listening at http://localhost:${process.env.PORT}`)
        })
    })
    .catch(error => {
        throw error
    })
