const Campground = require('../models/campground')
const cloudinary = require('cloudinary')

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
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.author = req.user._id
    console.log(campground)
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
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.images.push(...imgs)
    await campground.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
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