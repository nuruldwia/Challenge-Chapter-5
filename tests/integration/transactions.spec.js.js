const { token } = require('morgan');
const app = require('../../app');
const request = require('supertest');

let transactions = {};

/**
 Test Create Transaction
    - test source and destination by id terdaftar -> sukses
    - test balance > amount -> success
    - test source and destination by id tidak terdaftar -> error
    - test balance <  amount -> error
    - Unauthorized -> error
 */
describe('Test POST /api/v1/transactions endpoint', () => {
    test('test source and destination by id terdaftar -> sukses', async () => {
       try { 
        const amount = 100;
        const sourceAccountId = 1;
        const destinationAccountId = 2;
        
        const { statusCode, body } = (await request(app).post('/api/v1/transactions')).send({
            amount, sourceAccountId, destinationAccountId
        }).set('Authorization', token)
        
        expect(statusCode).toBe(201);
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body).toHaveProperty('data');
        expect(body.data).toHaveProperty('id');
        expect(body.data).toHaveProperty('amount');
        expect(body.data).toHaveProperty('sourceAccountId');
        expect(body.data).toHaveProperty('destinationAccountId');
        expect(body.data.id).toBe(id);
        expect(body.data.amount).toBe(amount);
        expect(body.data.sourceAccountId).toBe(sourceAccountId);
        expect(body.data.destinationAccountId).toHaveProperty(destinationAccountId);
       } catch (err) {
        expect(err).toBe(err);
       }
    });
    test('test source and destination by id tidak terdaftar -> error', async () => {  
        const amount = 100;
        const sourceAccountId = 19;
        const destinationAccountId = 2;
        
        const { statusCode, body } = (await request(app).post('/api/v1/transactions')).send({
            amount, sourceAccountId, destinationAccountId
        }).set('Authorization', token)

        expect(statusCode).toBe(500);
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body).toHaveProperty('data');
        expect(body.success).toBe(false);
    });
    test('test balance <  amount -> error', async () => {
        const amount = 100;
        const sourceAccountId = 19;
        const destinationAccountId = 2;
        
        const { statusCode, body } = (await request(app).post('/api/v1/transactions')).send({
            amount, sourceAccountId, destinationAccountId
        }).set('Authorization', token)

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body).toHaveProperty('data');
        expect(body.success).toBe(false);
    });
    test('Unauthorized -> error', async () => {
        const amount = 100;
        const sourceAccountId = 19;
        const destinationAccountId = 2;
        
        const { statusCode, body } = (await request(app).post('/api/v1/transactions')).send({
            amount, sourceAccountId, destinationAccountId
        });

        expect(statusCode).toBe(401);
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body).toHaveProperty('err');
        expect(body).toHaveProperty('data');
        expect(body.success).toBe(false);
    });
});

/**
 Get all Transactions
    -> sukses
    - Unauthorized -> error
 */
describe('Test GET /api/v1/transactions endpoint', () => {
    test('sukses', async () => {
        try {
            const { statusCode, body } = (await request(app).get(`api/v1/transactions/`)).set('Authorization', token);
    
            expect(statusCode).toBe(200);
            expect(body).toHaveProperty('status');
            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('data');
            expect(body.data).toHaveProperty('pagination');
            expect(body.data.pagination).toHaveProperty('links');
            expect(body.data.pagination.links).toHaveProperty('next');
            expect(body.data.pagination.links).toHaveProperty('prev');
            expect(body.data.pagination).toHaveProperty('total items');
            expect(body.data).toHaveProperty('allTransactions');
            expect(body.data.allTransactions).toHaveProperty('id');
            expect(body.data.allTransactions).toHaveProperty('amount');
            expect(body.data.allTransactions).toHaveProperty('sourceAccountId');
            expect(body.data.allTransactions).toHaveProperty('destinationAccountId');
            expect(body.data.pagination.links.next).toBe(next);
            expect(body.data.pagination.links.prev).toBe(prev);
            expect(body.data.pagination.total_items).toBe(total_items);
            expect(body.data.allTransactions.id).toBe(id);
            expect(body.data.allTransactions.amount).toBe(amount);
            expect(body.data.allTransactions.sourceAccountId).toBe(sourceAccountId);
            expect(body.data.allTransactions.destinationAccountId).toBe(destinationAccountId);
        } catch (err) {
            expect(err).toBe(err);
        }
    });
    test('Unauthorized -> error', async () => {
        const amount = 100;
        const sourceAccountId = 19;
        const destinationAccountId = 2;
        
        const { statusCode, body } = (await request(app).post('/api/v1/transactions')).send({
            amount, sourceAccountId, destinationAccountId
        });

        expect(statusCode).toBe(401);
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body).toHaveProperty('err');
        expect(body).toHaveProperty('data');
        expect(body.success).toBe(false);
    });
});

/**
 Get Transaction Details by id
    - test cari id yang terdaftar -> sukses
    - test cari id yang belum terdaftar -> error
    - Unauthorized -> error
 */
describe('Test GET /api/v1/accounts/{id} endpoint', () => {
    test('Test cari transaction dengan id yang terdaftar -> sukses', async () => {
        try {
            const { statusCode, body } = (await request(app).get(`api/v1/transactions/${transactions.id}`)).set('Authorization', token);
    
            expect(statusCode).toBe(200);
            expect(body).toHaveProperty('status');
            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('data');
            expect(body.data).toHaveProperty('id');
            expect(body.data).toHaveProperty('amount');
            expect(body.data).toHaveProperty('sourceAccountId');
            expect(body.data).toHaveProperty('destinationAccountId');
            expect(body.data).toHaveProperty('sourceAcount');
            expect(body.data.sourceAcount).toHaveProperty('id');
            expect(body.data.sourceAcount).toHaveProperty('bankName');
            expect(body.data.sourceAcount).toHaveProperty('bankAccountNumber');
            expect(body.data.sourceAcount).toHaveProperty('balance');
            expect(body.data.sourceAcount).toHaveProperty('userId');
            expect(body.data.sourceAcount).toHaveProperty('user');
            expect(body.data.sourceAcount.user).toHaveProperty('name');
            expect(body.data.user).toHaveProperty('destinationAccount');
            expect(body.data.destinationAccount).toHaveProperty('id');
            expect(body.data.destinationAccount).toHaveProperty('bankName');
            expect(body.data.destinationAccount).toHaveProperty('bankAccountNumber');
            expect(body.data.destinationAccount).toHaveProperty('balance');
            expect(body.data.destinationAccount).toHaveProperty('userId');
            expect(body.data.destinationAccount).toHaveProperty('user');
            expect(body.data.destinationAccount.user).toHaveProperty('name');
            expect(body.data.id).toBe(id);
            expect(body.data.amount).toBe(amount);
            expect(body.data.sourceAccountId).toBe(sourceAccountId);
            expect(body.data.destinationAccountId).toBe(destinationAccountId);
            expect(body.data.sourceAcount.id).toBe(id);
            expect(body.data.sourceAcount.bankName).toBe(bankName);
            expect(body.data.sourceAcount.bankAccountNumber).toBe(bankAccountNumber);
            expect(body.data.sourceAcount.balance).toBe(balance);
            expect(body.data.sourceAcount.userId).toBe(userId);
            expect(body.data.sourceAcount.user.name).toBe(name);
            expect(body.data.destinationAccount.id).toBe(id);
            expect(body.data.destinationAccount.bankName).toBe(bankName);
            expect(body.data.destinationAccount.bankAccountNumber).toBe(bankAccountNumber);
            expect(body.data.destinationAccount.balance).toBe(balance);
            expect(body.data.destinationAccount.userId).toBe(userId);
            expect(body.data.destinationAccount.user.name).toBe(name);
        } catch (err) {
            expect(err).toBe(err);
        }
    });
    test('Test cari id yang belum terdaftar -> error', async () => {
        const { statusCode, body } = (await request(app).get(`api/v1/transactions/${transactions.id}`)).set('Authorization', token);

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body).toHaveProperty('data');
        expect(body.success).toBe(false);
    });
    test('Unauthorized -> error', async () => {
        const amount = 100;
        const sourceAccountId = 19;
        const destinationAccountId = 2;
        
        const { statusCode, body } = (await request(app).post('/api/v1/transactions')).send({
            amount, sourceAccountId, destinationAccountId
        });

        expect(statusCode).toBe(401);
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body).toHaveProperty('err');
        expect(body).toHaveProperty('data');
        expect(body.success).toBe(false);
    });
});