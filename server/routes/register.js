const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

router.post('/api/register', async (req, res) => {
  const user = await User.findOne({ email: req.body.email })

  if (user) return res.json({ msg: 'Email is already registered' });

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    accounts: []
  });

  bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err;
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser.save();
    });
  });
  res.send({ msg: 'User successfully registered', newUser });
});

module.exports = router;
