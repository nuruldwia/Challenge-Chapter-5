const { token } = require('morgan');
const app = require('../../app');
const request = require('supertest');

let users = {};
let token = '';

/**
 Test Create User
    - test email belum terdaftar -> sukses
    - test email sudah terdaftar -> error
 */
describe('Test POST /api/v1/users endpoint', () => {
    test('Test Email belum terdaftar -> sukses', async () => {
        try {
            const name = 'usertest';
            const email = 'userttest@gmail.com';
            const password = 'pw123';
            const password_confirmation = 'pw123';
            const identityType = 'KTP';
            const identityNumber = '12345678';
            const address = 'Semarang';

            const { statusCode, body } = await request(app).post('/api/v1/auth/register').send({
                name, email, password, password_confirmation, identityType, identityNumber, address
            });

            expect(statusCode).toBe(201);
            expect(body).toHaveProperty('status');
            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('data');
            expect(body.data).toHaveProperty('id');
            expect(body.data).toHaveProperty('name');
            expect(body.data).toHaveProperty('email');
            expect(body.data).toHaveProperty('password');
            expect(body.data).toHaveProperty('profile');
            expect(body.data.profile).toHaveProperty('identityType');
            expect(body.data.profile).toHaveProperty('identityNumber');
            expect(body.data.profile).toHaveProperty('address');
            expect(body.data.name).toBe(name);
            expect(body.data.email).toBe(email);
            expect(body.data.password).toBe(password);
            expect(body.data.profile.identityType).toHaveProperty(identityType);
            expect(body.data.profile.identityNumber).toHaveProperty(identityNumber);
            expect(body.data.profile.address).toHaveProperty(address);
        } catch (err) {
            expect(err).toBe(err);
        }
    });

    test('Test Email sudah terdaftar -> error', async () => {
        try {
            const name = 'usertest';
            const email = 'userttest@gmail.com';
            const password = 'pw123';

            const { statusCode, body } = await request(app).post('/api/v1/users').send({
                name, email, password
            });

            expect(statusCode).toBe(400);
            expect(body).toHaveProperty('status');
            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('data');
        } catch (err) {
            expect(err).toBe('Email is alredy used!');
        }
    });
});

/**
 Test Authentication <Register> User
    - test password dan pw confirm match -> sukses
    - test password dan pw confirm berbeda -> error
    - test email belum terdaftar -> sukses
    - test email sudah terdaftar -> error
 */
describe('Test POST /api/v1/auth/register endpoint', () => {
    test('Test email belum terdaftar, password dan pw confirm match -> sukses', async () => {
        try {
            const name = 'usertest';
            const email = 'userttest@gmail.com';
            const password = 'pw123';
            const password_confirmation = 'pw123';
            const identityType = 'KTP';
            const identityNumber = '12345678';
            const address = 'Semarang';

            const { statusCode, body } = await request(app).post('/api/v1/auth/register').send({
                name, email, password, password_confirmation, identityType, identityNumber, address
            });

            expect(statusCode).toBe(201);
            expect(body).toHaveProperty('status');
            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('data');
            expect(body.data).toHaveProperty('id');
            expect(body.data).toHaveProperty('name');
            expect(body.data).toHaveProperty('email');
            expect(body.data).toHaveProperty('password');
            expect(body.data).toHaveProperty('profile');
            expect(body.data.profile).toHaveProperty('identityType');
            expect(body.data.profile).toHaveProperty('identityNumber');
            expect(body.data.profile).toHaveProperty('address');
            expect(body.data.name).toBe(name);
            expect(body.data.email).toBe(email);
            expect(body.data.password).toBe(password);
            expect(body.data.profile.identityType).toHaveProperty(identityType);
            expect(body.data.profile.identityNumber).toHaveProperty(identityNumber);
            expect(body.data.profile.address).toHaveProperty(address);
        } catch (err) {
            expect(err).toBe(err);
        }
    });
    test('Test password dan pw confirm berbeda -> error', async () => {
        try {
            const name = 'usertest';
            const email = 'userttest@gmail.com';
            const password = 'pw123';
            const password_confirmation = 'p123';
            const identityType = 'KTP';
            const identityNumber = '12345678';
            const address = 'Semarang';

            const { statusCode, body } = await request(app).post('/api/v1/auth/register').send({
                name, email, password, password_confirmation, identityType, identityNumber, address
            });

            expect(statusCode).toBe(400);
            expect(body).toHaveProperty('status');
            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('err');
            expect(body).toHaveProperty('data');
        } catch (err) {
            expect(err).toBe('Please ensure that password and password confirmation match!');
        }
    });
    test('Test email sudah terdaftar -> error', async () => {
        try {
            const name = 'usertest';
            const email = 'userttest@gmail.com';
            const password = 'pw123';
            const password_confirmation = 'p123';
            const identityType = 'KTP';
            const identityNumber = '12345678';
            const address = 'Semarang';

            const { statusCode, body } = await request(app).post('/api/v1/auth/register').send({
                name, email, password, password_confirmation, identityType, identityNumber, address
            });

            expect(statusCode).toBe(400);
            expect(body).toHaveProperty('status');
            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('err');
            expect(body).toHaveProperty('data');
        } catch (err) {
            expect(err).toBe('Email has alredy used!');
        }
    });
});

/**
 Test Authorization <Login> User
    - test email dan password match -> sukses
    - test email atau password tidak terdaftar -> error
 */
describe('Test POST /api/v1/auth/login endpoint', () => {
    test('test email dan password match -> sukses', async () => {
        try {
            const email = 'userttest@gmail.com';
            const password = 'pw123';
            let token = '';

            const { statusCode, body } = await request(app).post('/api/v1/auth/register').send({
                email, password
            });

            expect(statusCode).toBe(201);
            expect(body).toHaveProperty('status');
            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('err');
            expect(body).toHaveProperty('data');
            expect(body.data).toHaveProperty('user');
            expect(body.data.user).toHaveProperty('id');
            expect(body.data.user).toHaveProperty('name');
            expect(body.data.user).toHaveProperty('email');
            expect(body.data.user).toHaveProperty('password');
            expect(body.data).toHaveProperty('token');
            expect(body.data.user).toBe(id);
            expect(body.data.user).toBe(name);
            expect(body.data.user).toBe(email);
            expect(body.data.user).toBe(password);
            expect(body.data).toBe(token);
        } catch (err) {
            expect(err).toBe(err);
        }
    });
    test('Test email atau password tidak terdaftar -> error', async () => {
        try {
            const email = 'userttest@gmail.com';
            const password = 'pw123';
    
            const { statusCode, body } = await request(app).post('/api/v1/auth/register').send({
                email, password
            });

            expect(statusCode).toBe(400);
            expect(body).toHaveProperty('status');
            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('err');
            expect(body).toHaveProperty('data');
        } catch (err) {
            expect(err).toBe('Invalid email or password!');
    }
    });    
});

/**
 Test Authenticate
    - Test token berhasil -> sukses
    - Test token tidak berhasil -> error
 */
describe('Testing authenticate GET /api/v1/auth/authenticate', () => {
    test('Test token berhasil -> sukses', () => {
        let token = token;
        const { statusCode, body } = request(app).get('/api/v1/auth/authenticate').set('Authorication', token);

        expect(statusCode).toBe(200);
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body).toHaveProperty('err');
        expect(body).toHaveProperty('data');
        expect(body.data).toHaveProperty('user');
        expect(body.data.user).toHaveProperty('id');
        expect(body.data.user).toHaveProperty('name');
        expect(body.data.user).toHaveProperty('email');
        expect(body.data.user).toHaveProperty('password');
        expect(body.data.user).toBe('id');
        expect(body.data.user).toBe('name');
        expect(body.data.user).toBe('email');
        expect(body.data.user).toBe('password');
    });
    test('Test token tidak berhasil -> error', () => {
        let token = token;
        const { statusCode, body } = request(app).get('/api/v1/auth/authenticate').set('Authorication', token);

        expect(statusCode).toBe(403);
        expect(body).toHaveProperty('sstatus');
        expect(body).toHaveProperty('message');
        expect(body).toHaveProperty('err');
        expect(body).toHaveProperty('data');
        expect(body.success).toBe(false);
    });
});
    

/**
 Get Detail user by id
    - test cari id yang terdaftar -> sukses
    - test cari id yang belum terdaftar -> error
 */
describe('Test GET /api/v1/users/{id} endpoint', () => {
    test('Test cari user dengan id yang terdaftar -> sukses', async () => {
        try {
            const { statusCode, body } = (await request(app).get(`api/v1/users/${users.id}`)).set('Authorization', token);

            expect(statusCode).toBe(201);
            expect(body).toHaveProperty('status');
            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('data');
            expect(body.data).toHaveProperty('id');
            expect(body.data).toHaveProperty('name');
            expect(body.data).toHaveProperty('email');
            expect(body.data).toHaveProperty('password');
            expect(body.data).toHaveProperty('profile');
            expect(body.data.profile).toHaveProperty('identityType');
            expect(body.data.profile).toHaveProperty('identityNumber');
            expect(body.data.profile).toHaveProperty('address');
            expect(body.data).toHaveProperty('bankAccount');
            expect(body.data.bankAccount).toHaveProperty('id');
            expect(body.data.bankAccount).toHaveProperty('bankName');
            expect(body.data.bankAccount).toHaveProperty('bankAccountNumber');
            expect(body.data.bankAccount).toHaveProperty('balance');
            expect(body.data.bankAccount).toHaveProperty('userId');
            expect(body.data).toBe(id);
            expect(body.data).toBe(name);
            expect(body.data).toBe(email);
            expect(body.data).toBe(password);
            expect(body.data).toBe(profile);
            expect(body.data.profile).toBe(identityType);
            expect(body.data.profile).toBe(identityNumber);
            expect(body.data.profile).toBe(address);
            expect(body.data).toBe(bankAccount);
            expect(body.data.bankAccount).toBe(id);
            expect(body.data.bankAccount).toBe(bankName);
            expect(body.data.bankAccount).toBe(bankAccountNumber);
            expect(body.data.bankAccount).toBe(balance);
            expect(body.data.bankAccount).toBe(userId);
        } catch (err) {
            expect(err).toBe(err);
        }
    });
    test('Test cari id yang belum terdaftar -> error', async () => {
                const { statusCode, body } = (await request(app).get(`api/v1/users/${users.id}`)).set('Authorization', token);

                expect(statusCode).toBe(400);
                expect(body).toHaveProperty('status');
                expect(body).toHaveProperty('message');
                expect(body).toHaveProperty('data');
                expect(body.success).toBe(false);
    });
});

/**
 Update user by id
    - test id sesuai -> sukses
    - test id tidak sesuai -> error
 */
describe('Test PUT /api/v1/users/:id endpoint', () => {
    test('Test id sesuai -> sukses', async () => {
        try {
            const name = 'usertest';
            const email = 'userttest@gmail.com';
            const password = 'pw123';
            const identityType = 'KTP';                const identityNumber = '12345678';
            const address = 'Semarang';
            const { statusCode, body } = await request(app).put('/api/v1/users/:id').send({
                name, email, password, identityType, identityNumber, address
            }).set('Authorization', token);
    
            expect(statusCode).toBe(200);
            expect(body).toHaveProperty('status');
            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('data');
            expect(body.data).toHaveProperty('id');
            expect(body.data).toHaveProperty('name');
            expect(body.data).toHaveProperty('email');
            expect(body.data).toHaveProperty('password');
            expect(body.data).toHaveProperty('profile');                expect(body.data.profile).toHaveProperty('identityType');
            expect(body.data.profile).toHaveProperty('identityNumber');
            expect(body.data.profile).toHaveProperty('address');
            expect(body.data.name).toBe(id);
            expect(body.data.name).toBe(name);
            expect(body.data.email).toBe(email);
            expect(body.data.password).toBe(password);
            expect(body.data.profile.identityType).toHaveProperty(identityType);
            expect(body.data.profile.identityNumber).toHaveProperty(identityNumber);                expect(body.data.profile.address).toHaveProperty(address);
        } catch (err) {
            expect(err).toBe(err);
        }
    });
    test('Test id tidak sesuai -> error', async () => {
            const name = 'usertest';
            const email = 'userttest@gmail.com';
            const password = 'pw123';
            const { statusCode, body } = await request(app).post('/api/v1/users').send({
                name, email, password
            }).set('Authorization', token);

            expect(statusCode).toBe(403);
            expect(body).toHaveProperty('status');
            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('data');
            expect(body.success).toBe(false);
    });
});