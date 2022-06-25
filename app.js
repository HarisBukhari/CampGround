const express = require('express')
const app = express()
const path = require("path")
const mongoose = require('mongoose')
const Campground = require('./models/campground')


app.use(express.json())
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
    const campground = await Campground.find({})
    res.render('campground/index',{campground})
})

app.get('/campgrounds/new',(req,res)=>{
  res.render('campground/new')
})

app.post('/campgrounds',async (req,res)=>{
  const camp = new Campground(req.body)
  await camp.save()
  res.redirect(`/campgrounds/${camp._id}`)
})

app.get('/campgrounds/:id',async (req,res)=>{
    const campground = await Campground.findById(req.params.id)
    res.render('campground/show',{campground})
})



app.get('*',(req,res)=>{
    res.render('home')
})

app.listen(3000,(req,res)=>{
    console.log('Server is running port 3000')
})






















//npx Nodemon app.js