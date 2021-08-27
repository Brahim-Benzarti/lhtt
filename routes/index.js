var express = require('express');
var router = express.Router();
// var qs = require('querystring');
var Text=require('../modules/samples');
const bcrypt = require('bcrypt')
const passport = require('passport')
var Users=require('../modules/users');
var Word=require('../modules/words');

/* GET home page. */
router.get('/', checkNotAuthenticated, (req, res) => {
  res.render('index',);
});

router.get('/contact', checkNotAuthenticated,(req,res)=>{
  res.render('contact');
})

router.get('/still', checkNotAuthenticated,(req,res)=>{
  res.send('Comming soon');
})

router.get('/gethering_info', checkNotAuthenticated, (req,res)=>{
  res.render('gethering_info');
});

router.post('/gethering_info', checkNotAuthenticated,async (req,res)=>{
  let toul=Number(req.body.toul);
  // let begin=await Word.aggregate([{$sample:{size:120,$where:'this.word.length < 4'}}]);
  if(toul==30){ 
    let begin=await Word.aggregate([{$sample:{size:toul}}]);
    res.render('typing_test', {
      title: "Speed typing test",
      content: begin,
      id: "test_short"
    })
  }else if(toul==60){
    let begin=await Word.aggregate([{$sample:{size:toul}}]);
    res.render('typing_test', {
      title: "Speed typing test",
      content: begin,
      id: "test_normal"
    })
  }else if(toul==90){
    let begin=await Word.aggregate([{$sample:{size:toul}}]);
    res.render('typing_test', {
      title: "Speed typing test",
      content: begin,
      id: "test_long"
    })
  }
})

router.get('/texts', checkNotAuthenticated, async (req,res) =>{
  let text=await Text.find({});
  res.render('texts', {
    text_show: false,
    text: text
  })
})

router.post('/texts', checkNotAuthenticated,async (req,res) => {
  if(req.body.v == "0"){
    let text=await Text.find({}).limit();
    let text0=await Text.find({_id: req.body.texts});
    res.render('texts', {
      text_show: true,
      text0: text0[0],
      text: text,
      best: null,
      best_person: null
    })
  }else{
    let text=await Text.find({_id: req.body.texts});
    res.render('typing_test', {
      title: text[0].title,
      content: text[0].content,
      id: text[0]._id
    })
  }
})

router.get('/account', checkNotAuthenticated, (req, res) => {
  res.render('account');
})

router.post('/account', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/users',
  failureRedirect: '/account',
  failureFlash: true
}))

router.get('/guest', checkNotAuthenticated, (req, res) => {
  res.render('guest', {message: ""});
})

router.post('/guest', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user= new Users({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });
    const newtext= await user.save();
    res.redirect('account');
  } catch(err) {
    res.render("guest", {message: "<p class='text-danger'>Email already used!</p>"});
    console.log("creating user err",err);
  }
})

router.post('/_save', checkNotAuthenticated, (req,res)=>{
  res.render('_save');
})

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
    return res.redirect('/users')
  }
  next()
}

module.exports = router;

// router.post('/texts', async (req,res) =>{
//   if (req.method == 'POST') {
//     var body = '';
//     var sent;
//     req.on('data', function (data) {
//         body += data;

//         // Too much POST data, kill the connection!
//         // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
//         if (body.length > 1e6)
//             req.connection.destroy();
//     });
//     req.on('end', function () {
//         sent = qs.parse(body);
//     });
//   }
// })