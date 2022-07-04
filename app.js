if (process.env.NODE_ENV !== "production") {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const path = require("path")
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const ExpressError = require('./utils/ExpressError')
const session = require('express-session')
const flash = require('connect-flash')
const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')
const users = require('./routes/users')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')

//Mongo Connection
main().catch(err => console.log(err))
async function main() {
  await mongoose.connect('mongodb://localhost:27017/campground',{
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log("Connection Open")
}

//Session
const sessionConfig = {
  name:'session',
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
      httpOnly: true,
      secure: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

app.use(express.json())
app.engine('ejs',ejsMate)
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}))
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'/views'))

//Session and Flash
app.use(session(sessionConfig))
app.use(flash())
// app.use(helmet({contentSecurityPolicy:false}))

// //Helmet Policies
// const scriptSrcUrls = [
//   "https://stackpath.bootstrapcdn.com/",
//   "https://api.tiles.mapbox.com/",
//   "https://api.mapbox.com/",
//   "https://kit.fontawesome.com/",
//   "https://cdnjs.cloudflare.com/",
//   "https://cdn.jsdelivr.net",
// ];
// const styleSrcUrls = [
//   "https://kit-free.fontawesome.com/",
//   "https://stackpath.bootstrapcdn.com/",
//   "https://api.mapbox.com/",
//   "https://api.tiles.mapbox.com/",
//   "https://fonts.googleapis.com/",
//   "https://use.fontawesome.com/",
// ];
// const connectSrcUrls = [
//   "https://api.mapbox.com/",
//   "https://a.tiles.mapbox.com/",
//   "https://b.tiles.mapbox.com/",
//   "https://events.mapbox.com/",
// ];
// const fontSrcUrls = [];
// app.use(
//   helmet.contentSecurityPolicy({
//       directives: {
//           defaultSrc: [],
//           connectSrc: ["'self'", ...connectSrcUrls],
//           scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//           styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//           workerSrc: ["'self'", "blob:"],
//           objectSrc: [],
//           imgSrc: [
//               "'self'",
//               "blob:",
//               "data:",
//               "https://res.cloudinary.com/harisbukhari86/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
//               "https://images.unsplash.com/",
//           ],
//           fontSrc: ["'self'", ...fontSrcUrls],
//       },
//   })
// );

//Passport
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


//For Public Dir
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  res.locals.currentUser = req.user
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next();
})

////////Routes
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)
app.use('/', users)
app.use(
  mongoSanitize({
    replaceWith: '_',
  }),
)

app.get('/', (req, res) => {
  res.render('home')
});

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
    console.log('Server is running port 3000')
})

//npx Nodemon app.js