const express = require('express')
const router = express.Router()
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user')

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body
        //New User Creation Plus Passport Plugin
        const user = new User({ email, username })
        //Passport_Salt_Hash_!!req!!
        const registeredUser = await User.register(user, password)
        //Passport_!!req!!
        req.login(registeredUser, err => {
            if (err) return next(err)
            req.flash('success', 'Welcome to Yelp Camp!')
            res.redirect('/campgrounds')
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('register')
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login')
})

//Use keepSessionInfo: true for new passport version 
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', failureMessage: true, keepSessionInfo: true, }), (req, res) => {
    req.flash('success', 'welcome back!')
    //Passport_!!req!!_Session_Redirect
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirectUrl)
})

router.get('/logout', (req, res) => {
    //For New Passport version use this callback
    req.logOut(err => {
        if (err) return next(err)
        req.flash('success', "Goodbye!")
        res.redirect('/campgrounds')
    })
})

module.exports = router