const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

mongoose
  .connect(require('./config/keys').mongoURI, { useNewUrlParser: true })
  .then(() => console.log('database connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('home')
});

app.use(require('./routes/account'));
app.use(require('./routes/register'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`));
