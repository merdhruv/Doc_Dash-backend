const { response } = require('express')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const login = (req, res, next) => {
    var username = req.body.username
    var password = req.body.password


    User.findOne({$or: [{email:username},{userId:username}]})
    .then(user => {
        if(user){
            bcrypt.compare(password, user.password, function(err, result) {
                if(err){
                    res.json({
                        error : err
                    })
                }
                if(result){
                    let token = jwt.sign({name: user.name},  'AaBdr(23)', {expiresIn: '1h'})
                    res.json({
                        message: 'Success',
                        token
                    })
                }else{
                    res.json({
                        message: 'Password does not matched!'
                    })
                }
            })
        }else{
            res.json({
                message: 'No user found!'
            })
        }
    })
}

//Show the list of users
const index = (req, res, next) => {
    User.find()
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message: 'An error Occured!'
        })
    })
}

//show single user by id
const show = (req, res, next) => {
    let userId = req.body.userId
    User.findById(userId)
    .then(response => {
        res.json({
            response
        })
    })
    .catch(eroor => {
        res.json({
            message: 'An error Occured!'
        })
    })
}

//add user 
const adduser = (req, res, next) =>{
    bcrypt.hash(req.body.password, 10, function(err, hashedPass){
        if(err) {
            res.json({
                error: err
            })
        }
        let user = new User({
            userid: req.body.userid,
            username: req.body.username,
            password: hashedPass,
            fullname: req.body.fullname,
            contact: req.body.contact,
            email: req.body.email,
            role : req.body.role,
            status: req.body.status,
            doj: req.body.doj
        })
        user.save()
        .then(response => {
            res.json({
                message: 'User Added Succesfully!'
            })
        })
        .catch(error => {
            res.json({
                message: 'An error Occured!'
            })
        })
    })
}

//update an user
const update = (req, res, next) => {
    let userId = req.body.userId

    let updateData = {
        username: req.body.username,
        password: req.body.password,
        fullname: req.body.fullname,
        contact: req.body.contact,
        email: req.body.email,
        role : req.body.role,
        status: req.body.status,
        doj: req.body.doj
    }

    User.findByIdAndUpdate(userId, {$set: updateData})
    .then(() => {
        res.json({
            message: 'User updated successfully!'
        })
    })
    .catch(error => {
        res.json({
            message: 'An error Occured!'
        })
    })
}

//delete an employee
const destroy = (req, res) => {
    let userid = req.body.userid

    User.findByIdAndDelete(userid)
    .then(() => {
        res.json({
            message: 'User  deleted successfully!'
        })
    })
    .catch(error => {
        res.json({
            message: 'An error Occured!'
        }+error)
    })
}

module.exports = {
    index, show, adduser, update, destroy, login
}