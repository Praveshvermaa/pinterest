var express = require('express');
var router = express.Router();
const userModel = require("./users");
const passport = require('passport');
const localStrategy = require("passport-local")
const upload = require("./multer")
const postModel = require("./post")

passport.use(new localStrategy(userModel.authenticate()))

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { nav:false });
});
router.get("/userprofile",isLoggedIn,async function(req,res,next){
const user = await userModel
.findOne({username:req.session.passport.user})
.populate("posts")

  res.render("profile",{user})
})
router.get("/show/posts",isLoggedIn,async function(req,res,next){
  const user = await userModel
  .findOne({username:req.session.passport.user})
  .populate("posts")

 
    res.render("show",{user})
  })
  router.get("/feed",isLoggedIn,async function(req,res,next){
    const user = await userModel.findOne({username:req.session.passport.user})
    const posts = await postModel.find()
    .populate("user")
      res.render("feed",{user,posts})
    })
router.get('/add',(req,res)=>{
  res.render("add")
})
router.post('/createpost',upload.single("postimage"),async(req,res)=>{
  const userdata = await userModel.findOne({
    username:req.session.passport.user})
    const postdata = await postModel.create({
      user:userdata._id,
      title:req.body.title,
      description:req.body.description,
      image:req.file.filename
    })
    userdata.posts.push(postdata._id)
    await userdata.save()
   res.redirect("/userprofile")
  
})

router.post('/fileupload', upload.single("image"),async function(req, res, next) {
  const user = await userModel.findOne({
    username:req.session.passport.user
  })
  user.profileImage = req.file.filename;
  await user.save()
  res.redirect("/userprofile")
});
router.get("/register",(req,res)=>{
  res.render("register",{nav:false});
})

router.post("/register",(req,res)=>{
  const data = new userModel({
    username:req.body.username,
    email:req.body.email,
    contact:req.body.contact,
  })
  userModel.register(data,req.body.password)
  .then(function(){
    passport.authenticate("loacl")(req,res,function(){
      res.redirect("/userprofile")
    })
  })
 
})
router.post("/login",passport.authenticate("local",{
  successRedirect:"/userprofile",
  failureRedirect:"/"
}),function(req,res,next){
});
router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});


function isLoggedIn(req,res,next){
  if (req.isAuthenticated()){
return next()
  }
  res.redirect("/")
}


module.exports = router;
