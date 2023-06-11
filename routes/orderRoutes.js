const express = require('express')
const router = express.Router();

const { order } = require('./../models/')
const { user } = require('./../models/')
const port = 5000

router.get('/', (req, res) => res.render('index'))

router.get('/orders', (req, res) => {
    order.findAll().then( orders => res.render('orders',{orders}))
})

router.get('/new-order', (req, res) => res.render('new-order'))

router.get('/search', (req, res) => res.render('search'))

router.post('/search', (req, res) => {
    order.findAll({where:{tracking:req.body.tracking}})
    .then(orderInfo => res.render('order-info',{orderInfo}))
})

router.post('/orders', (req, res) => {
    const newOrder = req.body
    const reqName = newOrder.client.slice(0, newOrder.client.indexOf(' '))
    let orderCount
    user.findOne({where:{name:reqName}})
    .then(customer => {
        order.create(newOrder)
        .then(() => {
            user.update({count:customer.count + 1},{where:{name:reqName}})
            .then(e => {
                res.setHeader('Location', `http://localhost:${port}/users`)
                res.status(301).end()
            })
            .catch(e => console.log(e))

        })
    })
})

router.delete('/orders', (req, res) => {
    order.destroy({
        where:{},
        truncate:true
    })

    res.send('All Records have been deleted')
}) 

router.delete('/orders/:id', (req, res) => {
    const orderID = req.params.id

    const clientData = req.body.data
    const reqName = clientData.slice(0, clientData.indexOf(' '))
    
    user.findOne({where:{name:reqName}})
    .then(customer => {
        user.update({count:customer.count - 1},{where:{name:reqName}})
        .then(() => {
            order.destroy({where:{id:orderID}})
            .then(() => res.status(301).end())
            .catch(e => console.log(e))
        })
        .catch(e => console.log(e))
            
    })
    .catch(e => console.log(e))
})

router.get('/orders/:id', (req, res) => {
    const orderID = req.params.id
    order.findAll({where:{id:orderID}}).then(orderInfo => res.render('order-info',{orderInfo}))

})

router.get('/orders/upd/:id', (req, res) => {
    const orderID = req.params.id
    order.findAll({where:{id:orderID}}).then(orderInfo => res.render('update-order',{orderInfo}))
    
})

router.put('/orders/upd/:id', (req, res) => { 
    const orderID = req.params.id
    const newStatus = 2
    order.update({status:newStatus},{where:{id:orderID}}).then(() => res.status(301).end())
})

module.exports = router;
