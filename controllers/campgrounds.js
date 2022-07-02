const Campground = require('../models/campground')

module.exports.index = async(req,res)=>{
    const campgrounds = await Campground.find({})
    res.render('campground/index',{campgrounds})
}

module.exports.newForm = (req,res)=>{
    res.render('campground/new')
}

module.exports.createCamp = async(req,res)=>{
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground)
    campground.author = req.user._id
    await campground.save()
    req.flash('success', 'Successfully made a new Campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.show = async(req,res)=>{
    //populate to access inner object and populate {} to access inner INNER object
    const campground = await Campground.findById(req.params.id).populate({
      path: 'reviews',
      populate: {
          path: 'author'
      }
      }).populate('author')
    if (!campground) {
      req.flash('error', 'Cannot find that campground!')
      return res.redirect('/campgrounds')
  }
    req.session.returnTo = req.originalUrl
    res.render('campground/show',{campground})
}

module.exports.editForm = async(req,res)=>{
    const campground =await Campground.findById(req.params.id)
    if (!campground) {
      req.flash('error', 'Cannot find that campground!')
      return res.redirect('/campgrounds')
  }
    res.render('campground/edit',{campground})
}

module.exports.edit = async(req,res)=>{
    const campground =await Campground.findByIdAndUpdate(req.params.id,{...req.body.campground})
    req.flash('success', 'Successfully Updated Campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteForm = async(req,res)=>{
    //Save the ID in variable then find and delete (!one line code: Unable to delete)
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully Deleted Campground!')
    res.redirect(`/campgrounds/`)
}