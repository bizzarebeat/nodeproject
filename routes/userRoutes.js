const express = require('express')
const router = express.Router();

const { user } = require('./../models/');
const { order } = require('./../models/');
const port = 5000

const userController = require('./../controllers/userController.js');

router.get('/', (req, res) => res.render('index'))

router.get('/users', userController.user_index);

router.get('/new-user', (req, res) => res.render('new-user'))

router.post('/users', (req, res) => {
    const newEntry = req.body
    user.create(newEntry)
    .then(()=> {
            res.setHeader('Location', `http://localhost:${port}/users`)
            res.status(301).end()})
    .catch( e => console.log(e))
})

router.delete('/users', (req, res) => {
    user.destroy({
        where:{},
        truncate:true
    })

    res.send('All Records have been deleted')

}) 

router.delete('/users/:id', (req, res) => {
    const userID = req.params.id
    user.destroy({
        where:{id:userID}
    }).then(() => { res.status(301).end()})

})

router.get('/users/:id', (req, res) => {
    const userID = req.params.id
    let fullName = ''
    let userinfo = {}
    user.findAll({where:{id:userID}})
    .then(userinf => {
        fullName = userinf[0].name + " " + userinf[0].surname; 
        order.findAll({where:{client:fullName}}).then(orderinfo => res.render('user-info',{orderinfo, userinf}))
    })    
})

router.get('/users/upd/:id', (req, res) => {
    const userID = req.params.id
    user.findAll({where:{id:userID}}).then(userinfo => res.render('update-user',{userinfo}))
    
})

router.put('/users/:id', (req, res) => { 
    const userID = req.params.id
    const updateEntry = req.body

    user.findOne({where:{id:userID}})
    .then(entry => {
        let clientName = entry.name + " " + entry.surname
        let newName = updateEntry.name + " " + updateEntry.surname
        order.findAll({where:{client:clientName}})
        .then(ord => {
            ord.forEach(element => order.update({client:newName},{where:{id:element.id}}))
            user.update({name:updateEntry.name, surname:updateEntry.surname, email:updateEntry.email, count:updateEntry.count},{where:{id:userID}})
            .then (() => res.status(200).end())
            .catch(e => console.log(e))
        })
        .catch(e => console.log(e))


    })
    .catch(e => console.log(e))
   


})

module.exports = router;
