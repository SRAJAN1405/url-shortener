require('dotenv').config();
const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const cookieParser=require("cookie-parser");
const URL = require("./models/url");
const userRoute=require("./routes/user");
const path=require("path");
const { log } = require("console");
const staticRouter=require('./routes/staticRouter');
const {checkAuthentication,restrictTo}=require("./middlewares/auth");

const app = express();
const PORT = process.env.PORT;
connectToMongoDB(process.env.MONGO_URL).then(() =>
  console.log("Mongodb connected")
);
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkAuthentication);
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
app.use("/",staticRouter);
app.use("/user",userRoute);
app.use("/url",urlRoute);
app.get("/test",async(req,res)=>
{
  const allUrls=await URL.find({});
  return res.render('home',{
   urls:allUrls,

  });
});

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  // console.log(shortId)
  const entry = await URL.findOneAndUpdate(
    {
        shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  // console.log(entry)
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
