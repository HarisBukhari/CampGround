const express = require('express')
const app = express()
const path = require("path")
const mongoose = require('mongoose')
const Campground = require('./models/campground')

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://localhost:27017/campground',{
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log("Connection Open")
}


app.set('view engine','ejs')
app.set('views',path.join(__dirname,'/views'))

app.get('/campgrounds',async (req,res)=>{
    const campground = await Campground.find({})
    res.render('campground/index')
})

app.get('*',(req,res)=>{
    res.render('home')
})

app.listen(3000,(req,res)=>{
    console.log('Server is running port 3000')
})






















//npx Nodemon app.js