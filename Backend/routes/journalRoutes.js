import express from 'express';
import cors from 'cors';

const router = express.Router ();

router.post ('/post', (req, res) => {
  console.log ('hii');
  console.log (req.body);
  res.send ('Journal route is working');
});

router.route ('/getOne').get ((req, res) => {
  console.log ('hii');
  res.send ('Journal route is working');
});

router.route ('/getAl').get ((req, res) => {
  console.log ('hii');
  res.send ('Journal route is working');
});

export default router;
