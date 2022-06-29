const express = require('express')
const router = express.Router()
const Campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync')
const {campgroundSchema} =require('../utils/joischemas')


const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
  }

router.get('/',catchAsync(async(req,res)=>{
    const campgrounds = await Campground.find({})
    res.render('campground/index',{campgrounds})
}))

router.post('/',validateCampground,catchAsync(async(req,res)=>{
  // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
  const campground = new Campground(req.body.campground)
  await campground.save()
  res.redirect(`/campgrounds/${campground._id}`)
}))

router.put('/:id',validateCampground,catchAsync(async(req,res)=>{
  const campground =await Campground.findByIdAndUpdate(req.params.id,{...req.body.campground})
  res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/new',(req,res)=>{
  res.render('campground/new')
})

router.get('/:id/edit',catchAsync(async(req,res)=>{
  const campground =await Campground.findById(req.params.id)
  res.render('campground/edit',{campground})
}))

router.get('/:id',catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campground/show',{campground})
}))

router.delete('/:id',catchAsync(async(req,res)=>{
  const campground = await Campground.findOneAndDelete(req.params.id)
  res.redirect(`/campgrounds/`)
}))

module.exports = router