const express = require('express');
const router = express.Router();

var visitCounter = 1;

router.get('/', (req, res, next) => {
  res.render('audience');
});

router.get('/instruments', (req, res, next) => {
  res.render('instrumentsIndex');
});

router.get('/sound', (req, res, next) => {
  res.render('sound');
});

router.get('/synth', (req, res, next) => {
  if(!req.session.visitCount){
    req.session.visitCount = visitCounter;
    visitCounter++;
    console.log('session: ', req.session.visitCount);
    res.render('synth', {session: req.session.visitCount});
  }else{
    console.log('session: ', req.session.visitCount);
    res.render('synth', {session: req.session.visitCount});
  }
});

router.get('/background', (req, res, next) => {
  res.render('background');
});
router.get('/background2', (req, res, next) => {
  res.render('background2');
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
  if(!req.session.visitCount){
    req.session.visitCount = visitCounter;
    visitCounter++;
    console.log('session: ', req.session.visitCount);
    res.render('keyboard', {session: req.session.visitCount});
  }else{
    console.log('session: ', req.session.visitCount);
    res.render('keyboard', {session: req.session.visitCount});
  }
});

router.get('/d', (req, res, next) => {
  if(!req.session.visitCount){
    req.session.visitCount = visitCounter;
    visitCounter++;
    console.log('session: ', req.session.visitCount);
    res.render('dancerView', {session: req.session.visitCount});
  }else{
    console.log('session: ', req.session.visitCount);
    res.render('dancerView', {session: req.session.visitCount});
  }
});

module.exports = router;