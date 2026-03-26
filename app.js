const express = require("express");
const app = express()
const mongoose = require("mongoose")
const path = require("path");
const port = 8080;
const methodOverride = require("method-override")
const moongooseURL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("./models/listing.js")
async function main() {
    await mongoose.connect(moongooseURL)
}
main().then((res)=>{
    console.log("MongoDB Connected")
})

app.set("view engine", "ejs");
app.set(path.join(__dirname,"views"));

app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

 




app.get("/",(req,res)=>{
    res.send(`root page`)
})

app.get("/listings",async (req,res)=>{
    const allListings = await Listing.find();
    res.render("index.ejs",{allListings})
    // console.log(allListings)
    
})

app.get("/listings/:id",async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("show.ejs", {listing});
})
// app.get("/testListing", async (req,res)=>{
//     let sampleListing = new Listing({
//         title:"My Home",
//         description:"This is my Home",
//         price:25000,
//         location:"Kurnool",
//         country:"India"
//     })
//    await sampleListing.save().then((res)=>{
//         console.log(res)
//     })
//     res.send(sampleListing)
// })
app.listen(port, ()=>{
    console.log(`Server Started on ${port}`)
})