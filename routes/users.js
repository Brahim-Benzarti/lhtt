var express = require('express');
var router = express.Router();
var Text=require('../modules/samples');
var Attempt=require('../modules/attempts');
var Word=require('../modules/words');
var Users=require('../modules/users');

/* GET users listing. */
router.get('/',checkAuthenticated , function(req, res) {
  res.render('index');
});

router.delete('/',checkAuthenticated, (req, res) => {
  req.logOut()
  res.redirect('/')
})

router.get('/cheat',checkAuthenticated, async (req,res)=>{
  let current_user= await req.user;
  let query= await Users.remove({_id:current_user._id});
  query= await Attempt.remove({ref:current_user._id});
  req.logOut();
  res.redirect('/');
});

router.get('/add',checkAuthenticated, (req,res) => {
  res.render('add');
})

router.post('/add', checkAuthenticated, async (req,res) => {
  let current_user= await req.user;
  const text= new Text({
    title: req.body.title,
    content: req.body.content,
    creator: current_user.name
  });
  try{
    const newtext= await text.save();
    res.redirect("texts");
  }catch(err){
    res.redirect("error");
    console.log(err);
  }
})

router.get('/texts',checkAuthenticated, async (req,res) =>{
  let text=await Text.find({});
  res.render('texts', {
    text_show: false,
    text: text
  })
})

router.post('/texts',checkAuthenticated,async (req,res) => {
  if(req.body.v == "0"){
    let text=await Text.find({}).limit();
    let text0=await Text.find({_id: req.body.texts});
    console.log(text0[0].id);
    let best=await Attempt.find({text_ref: text0[0]._id}).sort({err:1,time_sec:1});
    if(best[0]){
      var best_person= await Users.findOne({_id:best[0].ref});
    }
    res.render('texts', {
      text_show: true,
      text0: text0[0],
      text: text,
      best: best[0],
      best_person: best_person
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

router.get('/gethering_info', checkAuthenticated, (req,res)=>{
  res.render('gethering_info');
})

router.post('/gethering_info', checkAuthenticated,async (req,res)=>{
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

router.get('/texts',checkAuthenticated, async (req,res) =>{
  let text=await Text.find({});
  res.render('texts', {
    text_show: false,
    text: text
  })
})


router.post('/_save', checkAuthenticated, async (req,res)=>{
  let current_user= await req.user;
  let attempt= new Attempt({
    ref: current_user._id,
    text_ref: req.body.text_ref,
    time: req.body.time,
    time_sec: req.body.time_sec, 
    err: req.body.err
  });
  try{
    let previous= await Attempt.findOne({ref: attempt.ref, text_ref: attempt.text_ref}).sort({_id:-1});
    let newAttempt= await attempt.save();
    res.render('_save' , {
      layout: false,
      current: attempt,
      previous: previous
    });
  }catch(er){
    console.log(er);
  }
})



async function checkAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {    
    res.locals.user =await req.user;
    return next()
  }
  res.redirect('/account')
}


module.exports = router;
