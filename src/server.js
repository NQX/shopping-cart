const express = require('express');
//const cors = require('cors');
const morgan = require('morgan');

const app = express();

require('./config/mongoose.js')(app);
require('./routeHandler.js')(app);

app.use('/files', express.static('files'));
app.use(express.urlencoded());
app.use(morgan('dev'));

//app.use(cors());


// app.get('/', (req, res) => {
//     res.json({
//         message: 'hello world'
//     });
// });

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`server running on: ${port}`);
});