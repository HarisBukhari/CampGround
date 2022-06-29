const express = require('express')
const router = express.Router()
const Campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync')
const {campgroundSchema} =require('../utils/joischemas')
const Review = require('../models/review');
const { reviewSchema } = require('../schemas.js');
const { campgroundSchema } = require('../schemas.js')

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
  }

router.get('/campgrounds',catchAsync((req,res)=>{
    const campgrounds = await Campground.find({})
    res.render('campground/index',{campgrounds})
}))

router.post('/campgrounds',validateCampground,catchAsync((req,res)=>{
  // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
  const campground = new Campground(req.body.campground)
  await campground.save()
  res.redirect(`/campgrounds/${campground._id}`)
}))

router.put('/campgrounds/:id',validateCampground,catchAsync((req,res)=>{
  const campground =await Campground.findByIdAndUpdate(req.params.id,{...req.body.campground})
  res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/campgrounds/new',(req,res)=>{
  res.render('campground/new')
})

router.get('/campgrounds/edit/:id',catchAsync((req,res)=>{
  const campground =await Campground.findById(req.params.id)
  res.render('campground/edit',{campground})
}))

router.get('/campgrounds/:id',catchAsync((req,res)=>{
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campground/show',{campground})
}))

router.delete('/campgrounds/:id',catchAsync((req,res)=>{
  const campground = await Campground.findOneAndDelete(req.params.id)
  res.redirect(`/campgrounds/`)
}))

module.exports = router