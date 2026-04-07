const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const port = 8080;
const methodOverride = require("method-override");
const mongooseURL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("./models/listing.js");
const User = require("./models/user.js");
const ejsMate = require("ejs-mate")

async function main() {
  await mongoose.connect(mongooseURL);
}
main().then((res) => {
  console.log("MongoDB Connected");
});


app.engine("ejs", ejsMate)
app.set("view engine", "ejs");
app.set(path.join(__dirname, "views"));

app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`root page`);
});

app.get("/signup", (req, res) => {
  res.render("signup.ejs")
})
app.post("/signup/success", async (req, res) => {
  try {
    let user = req.body.user;

    console.log(user);

    let checking = await User.findOne({ email: user.email });

    if (!checking) {
      await User.create(user);
      alert("email already exists")
      return res.redirect("/listings");
    } else {
      return res.send("Email  already exists");
    }

  } catch (err) {
    console.log(err);
    res.send("Error occurred");
  }
});

app.get("/login", (req, res) => {
  res.render("login.ejs")
});

app.post("/login/success", async (req, res) => {
  let user = req.body.user;
  console.log(user)
  try {
    let userDetails = await User.findOne({ email: user.email });
    if (!userDetails) {
      res.send(`${user.email} does not exists`)
    }
    else {
      if (userDetails.password === user.password) {
        res.send("Login successfull")
      }
      else {
        res.send("Wrong password")
      }
    }
  } catch (error) {
    res.send("Error Occurred")
  }
})


app.get("/listings", async (req, res) => {
  const allListings = await Listing.find();
  res.render("index.ejs", { allListings });
  // console.log(allListings)
});

app.get("/listings/new", (req, res) => {
  res.render("new.ejs");
});


app.post("/listings", async (req, res) => {
  console.log(req.body);
  let listing = req.body.listing;
  await Listing.insertOne(listing).then((result) => {
    console.log(result);
  });
  res.redirect("/listings");
});


app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  console.log(listing);
  res.render("show.ejs", { listing });
});

app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  // console.log(id)
  let listing = await Listing.findById(id)
  res.render("edit.ejs", { listing })
})

app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let listing = req.body.listing;
  // console.log(req.body)
  await Listing.findByIdAndUpdate(id, listing).then((result) => {
    console.log(result)
  })
  res.redirect("/listings")
})

app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id).then((res) => {
    console.log(res)
  })
  res.redirect("/listings")
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

app.listen(port, () => {
  console.log(`Server Started on ${port}`);
  console.log(`http://localhost:8080/`)
});
