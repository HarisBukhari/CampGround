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
        const price = Math.floor(Math.random() * 20) + 10
        const camps = new Campground ({
            location: `${cities[rand].city},${cities[rand].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            author: `62c06482e36e08796755d1b4`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            images: [
              {
                  url: 'https://res.cloudinary.com/harisbukhari86/image/upload/v1656846758/YelpCamp/2_eacnc8.jpg',
                  filename: 'YelpCamp/1'
              },
              {
                  url: 'https://res.cloudinary.com/harisbukhari86/image/upload/v1656846762/YelpCamp/1_g3bpjs.jpg',
                  filename: 'YelpCamp/2'
              }
          ]
        })
        await camps.save()
    }
}

seedDB().then(()=>{
    mongoose.connection.close()
})