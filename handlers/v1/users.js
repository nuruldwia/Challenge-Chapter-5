const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;
const { getPagination } = require('../../helpers/pagination');

module.exports = {
    // Create New User
    createUser: async (req, res, next) => {
        try {
            let { name, email, password, profile } = req.body;

            // check if user existed
            let existUser = await prisma.users.findUnique({ where: { email } });
            if(existUser) {
                return res.status(400).json({
                    status: false,
                    message: "Email is already used!",
                    data: null
                });
            }

            let newUser = await prisma.users.create({
                data: {
                    name,
                    email,
                    password,
                    profile: {
                        create: profile,
                    },
                },
            });

            res.status(201).json({
                status: true,
                message: "New User Created Successfully!",
                data: newUser,
            });

        } catch (err) {
            next(err);
        }
    },

    // Get All Users
    getAllUsers: async (req, res, next) => {
        try {
            let { limit = 10, page = 1} = req.query;
            limit = Number(limit);
            page = Number(page);

            let users = await prisma.users.findMany({
                include: {
                    profile: true,
                    bankAccount: true
                },
                skip: (page - 1) * limit,
                take: limit,
            });

            const { _count } = await prisma.users.aggregate({
                _count: { id: true }
            });

            let pagination = getPagination(req, _count.id, page, limit);

            res.status(200).json({
                status: true,
                message: "OK!",
                data: { pagination, users }
            });

        } catch (err) {
            next(err);
        }
    },

    // Get User Detail
    getUserDetail: async(req, res, next) => {
        try {
            let { id } = req.params;
            let user = await prisma.users.findUnique({
                where: { id: Number(id) },
                include: {
                    profile: true,
                    bankAccount: true
                }
            });

            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: "Bad Request!",
                    data: "No User Found with Id " + id 
                });
            }

            res.status(200).json({
                status: true,
                message: "OK!",
                data: user
            });

        } catch (err) {
            next(err);
        }
    },

    // Update User
    updateUser: async (req, res, next) => {
        try {
            let { id } = req.params;
            let { name, email, password, profile } = req.body;

            let user = await prisma.users.findUnique({ where: { id: Number(id) }});
            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: "User doesn\'t exist!",
                    data: null
                });
            }

            let update = await prisma.users.update({
                where: { id: Number(id) },
                data: { 
                    name, 
                    email, 
                    password,
                    profile: {
                        update: profile
                    },
                },
            });

            res.status(200).json({
                status: true,
                message: "User were Successfully Updated!",
                data: update
            });

        } catch (err) {
            next(err);
        }
    },

    // REGISTER
    register: async (req, res, next) => {
        try {
            let { name, email, password, password_confirmation, profile } = req.body;

            if (password != password_confirmation) {
                return res.status(400).json({
                    status: false,
                    message: 'Bad Request!',
                    err: 'Please ensure that password and password confirmation match!',
                    data: null
                });
            }

            let userExist = await prisma.users.findUnique({ where: { email }});
            if (userExist) {
                return res.status(400).json({
                    status: false,
                    message: 'Bad Request!',
                    err: 'Email has alredy used!',
                    data: null
                });
            }

            // to hash password
            const hashPassword = await bcrypt.hash(password, 10);
            
            let user = await prisma.users.create({
                data: {
                    name,
                    email,
                    password: hashPassword,
                    profile: {
                        create: profile,
                    },
                },
            });

            return res.status(201).json({
                status: true,
                message: "CREATED!",
                err: null,
                data: user
            });
        } catch (err) {
            next(err);
        }
    },

    // LOGIN 
    login: async (req, res, next) => {
        try {
            let { email, password } = req.body;

            let user = await prisma.users.findUnique({ where: {email}});
            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: 'Bad Request!',
                    err: 'Invalid email or password!',
                    data: null
                });
            }

            let isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                return res.status(400).json({
                    status: false,
                    message: 'Bad Request!',
                    err: 'Invalid email or password!',
                    data: null
                });
            }

            let token = jwt.sign({ id: user.id }, JWT_SECRET_KEY);

            return res.status(200).json({
                status: true,
                message: "OK!",
                err: null,
                data: { user, token }
            });
        } catch (err) {
            next(err);
        }
    },

    authentication: (req, res, next) => {
        try {
            return res.status(200).json({
                status: true,
                message: "OK!",
                err: null,
                data: { user: req.users }
            });
        } catch (err) {
            next(err);
        }
        
    }
};