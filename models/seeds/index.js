const mongoose = require('mongoose')
const Campground = require('../campground')
const cities = require('./cities')
const {places,descriptors} = require('./seedHelper')

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://localhost:27017/campground',{
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log("Connection Open")
}

const sample = array => array[Math.floor(Math.random()* array.length)]

const seedDB = async ()=>{
    await Campground.deleteMany({})
    for (let i=0;i<50;i++){
        const rand = Math.floor(Math.random()*100)
        const camps = new Campground ({
            location: `${cities[rand].city},${cities[rand].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camps.save()
    }
}

seedDB().then(()=>{
    mongoose.connection.close()
})