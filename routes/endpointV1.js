const express = require('express');
const router = express.Router();
const { createUser, getAllUsers, getUserDetail, updateUser, register,login, authentication } = require('../handlers/v1/users');
const { createBankAccount, getAllAccount, getDetailAccount } = require('../handlers/v1/bank_account')
const { createTransaction, getAllTransactions, getDetailTransaction } = require('../handlers/v1/transaction');
const { restrict } = require('../middlewares/auth.middlewares');

router.get('/', (req, res) => {
    res.status(200).json({
        status: true,
        message: 'Welcome to Basic Banking Prisma API!',
        data: null
    });
});

router.post('/users', createUser);
router.get('/users', getAllUsers);
router.get('/users/:id', restrict, getUserDetail);
router.put('/users/:id', restrict, updateUser);

router.post('/register', register);
router.post('/login', login);
router.get('/authenticate', restrict, authentication);

router.post('/accounts', restrict, createBankAccount);
router.get('/accounts', restrict, getAllAccount);
router.get('/accounts/:id', restrict, getDetailAccount);

router.post('/transactions', restrict, createTransaction);
router.get('/transactions', restrict, getAllTransactions);
router.get('/transactions/:id', restrict, getDetailTransaction)

module.exports = router;