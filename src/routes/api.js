const api = require('express').Router();

const authRouter = require('./auth/auth.router')
const categoriesRouter = require('./categories/categories.router')
const postsRouter = require('./posts/posts.router');
const usersRouter = require('./users/users.router')

api.use('/auth', authRouter);
api.use('/categories', categoriesRouter);
api.use('/posts', postsRouter);
api.use('/users', usersRouter);

module.exports = api;