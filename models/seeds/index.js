const mongoose = require('mongoose')
const Campground = require('../campground')

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://localhost:27017/campground',{
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log("Connection Open")
}

const seedDB = async ()=>{
    await Campground.deleteMany({})
    const c = new Campground({
        title: 'A Camp'
    })
    await c.save()
}

seedDB()