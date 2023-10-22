const { token } = require('morgan');
const app = require('../../app');
const request = require('supertest');

let accounts = {};

/**
 Test Create Bank Account
    - test user id terdaftar -> sukses
    - test user id tidak terdaftar -> error
    - Unauthorized -> error
 */
describe('Test POST /api/v1/accounts endpoint', () => {
    test('test user id terdaftar -> sukses', async () => {
        try {
            const bankName = 'BNI';
            const bankAccountNumber = '56823001';
            const balance = 5000000;
            const userId = 5;
    
            const { statusCode, body } = await request(app).post('/api/v1/auth/register').send({
                bankName, bankAccountNumber, balance, userId
            }).set('Authorization', token);
    
            expect(statusCode).toBe(201);
            expect(body).toHaveProperty('status');
            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('data');
            expect(body.data).toHaveProperty('id');
            expect(body.data).toHaveProperty('bankName');
            expect(body.data).toHaveProperty('bankAccountNumber');
            expect(body.data).toHaveProperty('balance');
            expect(body.data).toHaveProperty('userId');
            expect(body.data.id).toBe(id);
            expect(body.data.bankName).toBe(bankName);
            expect(body.data.bankAccountNumber).toBe(bankAccountNumber);
            expect(body.data.balance).toHaveProperty(balance);
            expect(body.data.userId).toHaveProperty(userId);
        } catch (err) {
            expect(err).toBe(err);
        }
    });
    test('Test user id tidak terdaftar -> error', async () => {
        const bankName = 'BNI';
        const bankAccountNumber = '56823001';
        const balance = 5000000;
        const userId = 20;
                
        const { statusCode, body } = await request(app).post('/api/v1/auth/register').send({
            bankName, bankAccountNumber, balance, userId
        }).set('Authorization', token);

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
 Get all Bank Accounts
    -> sukses
    - Unauthorized -> error
 */
describe('Test GET /api/v1/accounts endpoint', () => {
    test('sukses', async () => {
        try {
            const { statusCode, body } = (await request(app).get(`api/v1/accounts/`)).set('Authorization', token);
    
            expect(statusCode).toBe(200);
            expect(body).toHaveProperty('status');
            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('data');
            expect(body.data).toHaveProperty('pagination');
            expect(body.data.pagination).toHaveProperty('links');
            expect(body.data.pagination.links).toHaveProperty('next');
            expect(body.data.pagination.links).toHaveProperty('prev');
            expect(body.data.pagination).toHaveProperty('total items');
            expect(body.data).toHaveProperty('accounts');
            expect(body.data.accounts).toHaveProperty('id');
            expect(body.data.accounts).toHaveProperty('bankName');
            expect(body.data.accounts).toHaveProperty('bankAccountNumber');
            expect(body.data.accounts).toHaveProperty('balance');
            expect(body.data.accounts).toHaveProperty('userId');
            expect(body.data.pagination.links.next).toBe(next);
            expect(body.data.pagination.links.prev).toBe(prev);
            expect(body.data.pagination.total_items).toBe(total_items);
            expect(body.data.accounts.id).toBe(id);
            expect(body.data.accounts.bankName).toBe(bankName);
            expect(body.data.accounts.bankAccountNumber).toBe(bankAccountNumber);
            expect(body.data.accounts.balance).toBe(balance);
            expect(body.data.accounts.userId).toBe(userId);
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
 Get Detail bank account by id
    - test cari id yang terdaftar -> sukses
    - test cari id yang belum terdaftar -> error
    - Unauthorized -> error
 */
describe('Test GET /api/v1/accounts/{id} endpoint', () => {
    test('Test cari user dengan id yang terdaftar -> sukses', async () => {
        try {
            const { statusCode, body } = (await request(app).get(`api/v1/accounts/${accounts.id}`)).set('Authorization', token);
    
            expect(statusCode).toBe(200);
            expect(body).toHaveProperty('status');
            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('data');
            expect(body.data).toHaveProperty('id');
            expect(body.data).toHaveProperty('bankName');
            expect(body.data).toHaveProperty('bankAccountNumber');
            expect(body.data).toHaveProperty('balance');
            expect(body.data).toHaveProperty('userId');
            expect(body.data).toHaveProperty('user');
            expect(body.data.user).toHaveProperty('name');
            expect(body.data.user).toHaveProperty('email');
            expect(body.data.id).toBe(id);
            expect(body.data.bankName).toBe(bankName);
            expect(body.data.bankAccountNumber).toBe(bankAccountNumber);
            expect(body.data.balance).toBe(balance);
            expect(body.data.userId).toBe(userId);
            expect(body.data.user.name).toBe(name);
            expect(body.data.user.email).toBe(email);
        } catch (err) {
            expect(err).toBe(err);
        }
    });
    test('Test cari id yang belum terdaftar -> error', async () => {
        const { statusCode, body } = (await request(app).get(`api/v1/accounts/${accounts.id}`)).set('Authorization', token);

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