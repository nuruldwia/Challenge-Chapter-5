require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const { PORT = 3001 } = process.env;
const endpointV1 = require('./routes/endpointV1');
var logger = require('morgan');

app.use(logger('dev'));
app.use(express.json());
app.use('/api/v1', endpointV1);

const authRouter = require('./routes/endpointV1');
app.use('/api/v1/auth', authRouter);

app.use('/api/v1/users', require('./routes/endpointV1'));
app.use('/api/v1/transaction', require('./routes/endpointV1'));
app.use('/api/v1/bank_account', require('./routes/endpointV1'));

// 404 error handling
app.use((req, res, next) => {
    res.status(404).json({
        status: false,
        message: 'Not Found',
        data: null
    });
});

// 500 error handling
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({
        status: false,
        message: 'Internal Server Error',
        data: err.message
    });
    next();
});

app.listen(PORT, () => console.log(`listening on port ${PORT}`));

module.exports = app;