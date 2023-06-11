const { user } = require('./../models/')

const user_index = (req, res) => {
    user.findAll().then( users => res.render('users',{users}))
}

module.exports = {
    user_index
}