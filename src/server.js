const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({path: './.ENV'});

const app = express();


app.use('/files', express.static('files'));
app.use(express.static(path.join(__dirname, "build")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use(cors());

require('./config/mongoose.js')(app);
require('./routeHandler.js')(app);



const port = process.env.PORT|| 3005;

app.listen(port, () => {
    console.log(`server running on: ${port}`);
});