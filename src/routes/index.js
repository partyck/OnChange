const express = require('express');
const router = express.Router();

var visitCounter = 1;

router.get('/', (req, res, next) => {
  res.render('index');
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

router.get('/sound', (req, res, next) => {
  res.render('sound');
});

router.get('/audience', (req, res, next) => {
  res.render('audience');
});

router.get('/background', (req, res, next) => {
  res.render('background');
});
router.get('/background2', (req, res, next) => {
  res.render('background2');
});

module.exports = router;