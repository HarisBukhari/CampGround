const express = require('express')
const app = express()
const path = require("path")
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const ExpressError = require('./utils/ExpressError')
const session = require('express-session');
const flash = require('connect-flash');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

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




////////Routes
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

//Middlewares
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!'
  res.status(statusCode).render('error', { err })
})

//*
app.get('*',(req,res)=>{
  res.render('home')
})

//Server
app.listen(3000,(req,res)=>{
    console.log('Server is running port 3000h')
})






















//npx Nodemon app.js