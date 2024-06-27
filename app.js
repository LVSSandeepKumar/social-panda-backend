const express = require('express');
require('dotenv').config()
const { default: mongoose } = require('mongoose');
var cors = require('cors')
const app = express();
const port = 8000; 

app.use(express.json(),cors());
const uri = process.env.MONGODB_URL; 


mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
 const db=mongoose.connection;

db.once('open',()=>console.log("Connected"))

app.get('/', (req, res) => {
  res.send('Hello, this is your Express app!');
});

//User Route
const userRoute = require('./routes/userRoute');
app.use('/user', userRoute, cors());

//Post Route
const postRoute = require('./routes/postRoute');
app.use('/post', postRoute, cors());

//Comment Route
const commentRoute = require('./routes/commentRoute');
app.use('/comment', commentRoute, cors());



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});