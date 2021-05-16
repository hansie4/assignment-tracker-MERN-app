import express from 'express'
import mongodb from 'mongodb'
import dotenv from 'dotenv'

/* -----------------DEV----------------- */
// Load Environmental Variables
const environmentalVars = dotenv.config({ path: './configs.env' })

if (environmentalVars.error) {
    throw environmentalVars.error
} else {
    console.log('Environmental Variables Loaded')
}


// Start Application
const app = express()

app.use(express.json())


// Connect to Database
const DBClient = new mongodb.MongoClient(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

DBClient.connect(err => {
    if (err) { throw err }

    console.log('Connected to MongoDB Database')


    app.listen(process.env.PORT, () => {
        console.log(`Assignment Tracker backend listening at http://localhost:${process.env.PORT}`)
    })
})
