const axios = require('axios')
const express = require('express')
const app = express()
const mysql = require('mysql2/promise')

//const UserGen = 10
const db = require('./models')
const { user } = require('./models')
const { order } = require('./models')
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/public', express.static('public'))
const port = 5000

const userRouter = require('./routes/userRoutes.js')
const orderRouter = require('./routes/orderRoutes.js')
app.use(userRouter)
app.use(orderRouter)

app.set('view engine', 'ejs') // enable ejs

const createDB = async(db) => {
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
    })
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${db};`)
    console.log('Database created successfully!')
    await connection.end()

}

const generateOrders = (customer, count) => {

    for (let i = 0; i < count; i++) {
        let track = Math.floor(Math.random() * 9000000 + 1000000)
        let orderStatus = Math.floor(Math.random() * 2 + 1)
        order.create({tracking:track, client:customer, status:orderStatus}).catch(e =>console.log(e))    
    }
}

const getUserData = async() => {
    const response = await axios.get(`https://peoplegeneratorapi.live/api/person/10`)
    const data = response.data
    let userData = [] 
    
    data.forEach(element => {
        let user = {name:"", email:""}
        user.name = element.name
        user.email = element.email
        userData.push(user)
    });
    return new Promise((resolve, reject) => resolve(userData))
}

const fillDB = () => {
    getUserData().then(data => data.forEach( elem => {
        let fullName = elem.name
        let fname = fullName.slice(0, fullName.indexOf(' '))
        let sname = fullName.slice(fullName.indexOf(' ') + 1)
        let email = elem.email
        let orders = Math.floor(Math.random() * 10)
        generateOrders(fullName, orders)
        user.create({name:fname, surname:sname, email:email, count:orders}).then(() => console.log("added")).catch(e =>console.log(e))
    }))
}

const syncDB = async() => {
 
    // Create the tables and sync the models with the database
    await db.sequelize.sync()
    startServer()
    console.log('Models synchronized successfully!');
}

const startServer = () => {
    app.listen(port, () => console.log(`listening at  http://localhost:${port}`))
}

const runServer = async() => {
    try {
      await createDB('avalon')
      await syncDB()
      fillDB()
    } catch (error) {
      console.error('Error creating and syncing database:', error);
    }
}

runServer()





