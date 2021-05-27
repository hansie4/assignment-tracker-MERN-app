const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const authRoute = require('./routes/auth')
const accountsRoute = require('./routes/account')
const trackerRoute = require('./routes/tracker')

/* ----------------------------------DEV---------------------------------- */
// Load Environmental Variables
if (process.env.NODE_ENV === 'development') {
    const dotenv = require('dotenv')
    const environmentalVars = dotenv.config({ path: './configs.env' })
    if (environmentalVars.error) {
        throw environmentalVars.error
    } else {
        console.log('Environmental Variables Loaded')
    }
}

// Start Application
const app = express()

// Use Middleware
app.use(express.json())
app.use(cookieParser(process.env.COOKIE_SECRET))

// Use Routes
app.use('/auth', authRoute)
app.use('/account', accountsRoute)
app.use('/tracker', trackerRoute)

// Connect to Database
mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
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
