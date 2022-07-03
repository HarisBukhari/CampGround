const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const {isLoggedIn,validateCampground,isAuthor} = require('../middleware')
const campgrounds = require('../controllers/campgrounds')
const multer = require('multer')
// const { storage } = require('../cloudinary')
const upload = multer({ dest:'uploads/' })

router.get('/',catchAsync(campgrounds.index))

router.get('/new',isLoggedIn,campgrounds.newForm)

// router.post('/',isLoggedIn,validateCampground,catchAsync(campgrounds.createCamp))
router.post('/',upload.array('image'),(req,res)=>{
    console.log(req.body,req.files)
    res.send("Done")
})

router.get('/:id',catchAsync(campgrounds.show))

router.get('/:id/edit', isLoggedIn, isAuthor,catchAsync(campgrounds.editForm))

router.put('/:id', isLoggedIn, isAuthor,validateCampground,catchAsync(campgrounds.edit))

router.delete('/:id', isLoggedIn, isAuthor,catchAsync(campgrounds.deleteForm))

module.exports = router