const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const moongooseURL = "mongodb://127.0.0.1:27017/wanderlust";


async function main() {
  await mongoose.connect(moongooseURL);
}
main()
  .then((res) => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

const  initDB = async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data)
    console.log(`DB intialized with the Data`)
}
initDB()