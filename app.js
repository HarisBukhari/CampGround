const express = require('express')
const app = express()
const path = require("path")
const mongoose = require('mongoose')
const Campground = require('./models/campground')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')

app.use(express.json())
app.engine('ejs',ejsMate)
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}))


app.set('view engine','ejs')
app.set('views',path.join(__dirname,'/views'))


main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://localhost:27017/campground',{
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log("Connection Open")
}

app.get('/campgrounds',async (req,res)=>{
    const campgrounds = await Campground.find({})
    res.render('campground/index',{campgrounds})
})

app.post('/campgrounds',async (req,res)=>{
  const campground = new Campground(req.body.campground)
  await campground.save()
  res.redirect(`/campgrounds/${campground._id}`)
})

app.put('/campgrounds/:id',async (req,res)=>{
  const campground =await Campground.findByIdAndUpdate(req.params.id,{...req.body.campground})
  res.redirect(`/campgrounds/${campground._id}`)
})

app.get('/campgrounds/new',(req,res)=>{
  res.render('campground/new')
})

app.get('/campgrounds/edit/:id',async (req,res)=>{
  const campground =await Campground.findById(req.params.id)
  res.render('campground/edit',{campground})
})

app.get('/campgrounds/:id',async (req,res)=>{
    const campground = await Campground.findById(req.params.id)
    res.render('campground/show',{campground})
})

app.delete('/campgrounds/:id',async (req,res)=>{
  const campground = await Campground.findByIdAndRemove(req.params.id)
  res.redirect(`/campgrounds/`)
})



app.get('*',(req,res)=>{
    res.render('home')
})

app.listen(3000,(req,res)=>{
    console.log('Server is running port 3000h')
})






















//npx Nodemon app.js