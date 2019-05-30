const express = require('express');
const router = express.Router();

var visitCounter = 1;

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/synth', (req, res, next) => {
  res.render('synth');
});

router.get('/background', (req, res, next) => {
  res.render('background');
});

router.get('/knob', (req, res, next) => {
  if(!req.session.visitCount){
    req.session.visitCount = visitCounter;
    visitCounter++;
    console.log('session: ', req.session.visitCount);
    res.render('knob', {session: req.session.visitCount});
  }else{
    console.log('session: ', req.session.visitCount);
    res.render('knob', {session: req.session.visitCount});
  }
});

router.get('/kick', (req, res, next) => {
  if(!req.session.visitCount){
    req.session.visitCount = visitCounter;
    visitCounter++;
    console.log('session: ', req.session.visitCount);
    res.render('kick', {session: req.session.visitCount});
  }else{
    console.log('session: ', req.session.visitCount);
    res.render('kick', {session: req.session.visitCount});
  }
});

router.get('/keyboard', (req, res, next) => {
  res.render('keyboard');
});

module.exports = router;