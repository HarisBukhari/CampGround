const express = require('express')
const router = express.Router()
const Campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync')
const {isLoggedIn,validateCampground,isAuthor} = require('../middleware')


router.get('/',catchAsync(async(req,res)=>{
    const campgrounds = await Campground.find({})
    res.render('campground/index',{campgrounds})
}))

router.post('/',isLoggedIn,validateCampground,catchAsync(async(req,res)=>{
  // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
  const campground = new Campground(req.body.campground)
  await campground.save()
  req.flash('success', 'Successfully made a new Campground!')
  res.redirect(`/campgrounds/${campground._id}`)
}))

router.put('/:id',isAuthor,isLoggedIn,validateCampground,catchAsync(async(req,res)=>{
  //populate to access inner object and populate {} to access inner INNER object
  const campground = await Campground.findById(req.params.id).populate({
    path: 'reviews',
    populate: {
        path: 'author'
    }
    }).populate('author');
  req.flash('success', 'Successfully Updated Campground!')
  res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/new',isLoggedIn,(req,res)=>{
  res.render('campground/new')
})

router.get('/:id/edit',isAuthor,isLoggedIn,catchAsync(async(req,res)=>{
  const campground =await Campground.findById(req.params.id)
  if (!campground) {
    req.flash('error', 'Cannot find that campground!')
    return res.redirect('/campgrounds')
}
  res.render('campground/edit',{campground})
}))

router.get('/:id',catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id).populate('reviews').populate('author')
    if (!campground) {
      req.flash('error', 'Cannot find that campground!')
      return res.redirect('/campgrounds')
  }
    req.session.returnTo = req.originalUrl
    res.render('campground/show',{campground})
}))

router.delete('/:id',isAuthor,isLoggedIn,catchAsync(async(req,res)=>{
  const campground = await Campground.findOneAndDelete(req.params.id)
  req.flash('success', 'Successfully Deleted Campground!')
  res.redirect(`/campgrounds/`)
}))

module.exports = router