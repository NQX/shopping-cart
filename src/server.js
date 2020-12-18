const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config({path: './.ENV'});

const app = express();


app.use('/files', express.static('files'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use(cors());

require('./config/mongoose.js')(app);
require('./routeHandler.js')(app);



const port = process.env.PORT|| 3005;

app.listen(port, () => {
    console.log(`server running on: ${port}`);
});