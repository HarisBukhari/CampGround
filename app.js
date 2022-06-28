const express = require('express')
const app = express()
const path = require("path")
const mongoose = require('mongoose')
const Campground = require('./models/campground')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const {campgroundSchema} =require('./utils/joischemas')

app.use(express.json())
app.engine('ejs',ejsMate)
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}))


app.set('view engine','ejs')
app.set('views',path.join(__dirname,'/views'))

//Mongo Connection
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://localhost:27017/campground',{
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log("Connection Open")
}

//Methods
const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
  } else {
      next();
  }
}

//Routes
app.get('/campgrounds',catchAsync(async (req,res)=>{
    const campgrounds = await Campground.find({})
    res.render('campground/index',{campgrounds})
}))

app.post('/campgrounds',validateCampground,catchAsync(async (req,res)=>{
  const campground = new Campground(req.body.campground)
  await campground.save()
  res.redirect(`/campgrounds/${campground._id}`)
}))

app.put('/campgrounds/:id',validateCampground,catchAsync(async (req,res)=>{
  const campground =await Campground.findByIdAndUpdate(req.params.id,{...req.body.campground})
  res.redirect(`/campgrounds/${campground._id}`)
}))

app.get('/campgrounds/new',(req,res)=>{
  res.render('campground/new')
})

app.get('/campgrounds/edit/:id',catchAsync(async (req,res)=>{
  const campground =await Campground.findById(req.params.id)
  res.render('campground/edit',{campground})
}))

app.get('/campgrounds/:id',catchAsync(async (req,res)=>{
    const campground = await Campground.findById(req.params.id)
    res.render('campground/show',{campground})
}))

app.delete('/campgrounds/:id',catchAsync(async (req,res)=>{
  const campground = await Campground.findByIdAndRemove(req.params.id)
  res.redirect(`/campgrounds/`)
}))

app.get('*',(req,res)=>{
    res.render('home')
})


//Middlewares
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!'
  res.status(statusCode).render('error', { err })
})



//Server
app.listen(3000,(req,res)=>{
    console.log('Server is running port 3000h')
})






















//npx Nodemon app.js