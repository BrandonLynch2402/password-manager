const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Account = require('../models/Account');
const User = require('../models/User');

let userID = '';

// Login
router.post('/api/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.json({ msg: 'User not found'});
  const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
  if (!passwordIsValid) {
    res.send({
      auth: false,
      token: null,
      msg: 'Password is incorrect'
    });
  }
  const token = jwt.sign({ id: user._id}, 'secret', { expiresIn: 86400});
  res.send({ auth: true, token, user, msg: 'Success'});
  userID = user._id;
});

// Get accounts
router.get('/api/get_accounts/', async (req, res) => {
  const user = await User.findOne({ _id: userID });
  res.send(user.accounts);
});

// Get account
router.get('/api/get_accounts/:id', async (req, res) => {
  const user = await User.findOne({ _id: userID })
  user.accounts.forEach(account => {
    if (account.account == req.params.id) {
      res.send(account)
    }
  })
});

// Add account
router.post('/api/new_account', (req, res) => {
  const newAccount = new Account({
    account: req.body.account,
    email: req.body.email,
    password: req.body.password,
    username: req.body.username
  });

  User
    .updateOne({ _id: userID },
    {$push: { accounts: newAccount }},
    (err) => {
      if (err) throw err;
  });

  res.json({ msg: 'account successfully added', newAccount });
});

module.exports = router;
