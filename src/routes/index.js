const express = require('express');
const router = express.Router();
let scene = require('../scene.js')

let sessionsCounter = 0;

router.get('/', (req, res, next) => {
  console.log('scene: ', scene.getScene());
  res.render('index', { scene: scene.getScene() });
});

router.get('/dancer', (req, res, next) => {
  if (!req.session.visitCount) {
    req.session.visitCount = sessionsCounter;
    sessionsCounter++;
  }
  console.log('scene: ', scene.getScene());
  console.log('session: ', req.session.visitCount);
  res.render('dancer', { session: req.session.visitCount, scene: scene.getScene() });
});

router.get('/sound', (req, res, next) => {
  console.log('scene: ', scene.getScene());
  res.render('sound', { scene: scene.getScene() });
});

router.get('/audience', (req, res, next) => {
  console.log('scene: ', scene.getScene());
  res.render('audience', { scene: scene.getScene() });
});

router.get('/background', (req, res, next) => {
  console.log('scene: ', scene.getScene());
  res.render('background', { scene: scene.getScene() });
});

module.exports = router;