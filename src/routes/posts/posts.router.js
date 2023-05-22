const postsRouter = require('express').Router();

const { authToken } = require('../../middleware/auth');
const { uploads } = require('../../utils/multer');
const {
    httpGetPosts,
    httpGetPostByID,
    httpGetPostByCategory,
    httpGetPostsCount,
    httpCreatePost,
    httpUpdatePost,
    httpToggleLike,
    httpGetTotalLikes,
    httpDeletePost,
} = require('./posts.controller');


postsRouter.get('/', httpGetPosts);
postsRouter.get('/:id', authToken, httpGetPostByID);
postsRouter.get('/get/categories', httpGetPostByCategory);
postsRouter.get('/get/count', authToken, httpGetPostsCount);
postsRouter.post('/', authToken, uploads.single('image'), httpCreatePost);
postsRouter.put('/:id', authToken, uploads.single('image'), httpUpdatePost);
postsRouter.put('/toggle/likes/:id', authToken, httpToggleLike)
postsRouter.get('/get/likes/:id', httpGetTotalLikes);
postsRouter.delete('/:id', authToken, httpDeletePost);


module.exports = postsRouter;
