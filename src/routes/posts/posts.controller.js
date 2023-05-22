const mongoose = require('mongoose');

const Post = require('../../models/posts.model');
const User = require('../../models/users.model');
const Cateory = require('../../models/categories.model');
const handleError = require('../../utils/errors.handler');

/**
 * Get all posts.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response containing the posts or an error message.
 */
const httpGetPosts = async (req, res) => {
    try {
        // Retrieve all posts and select specific fields
        const posts = await Post.find({})
            .select('title image author category likes comments')
            .populate({ path: 'author', select: 'username -_id' })
            .populate({ path: 'likes', select: 'username -_id' })
            .sort('-createdAt');
      
        // Handle if no posts are found
        if (posts.length === 0) return res.status(404).json({ message: 'No posts found' });

        // Set the response status and send the posts
        res.header('Content-Type', 'application/json');
        res.status(200).json({ posts });
    } catch (error) {
        const errors = handleError(error);

        // Set the response headers and handle validation errors or other errors
        res.header('Content-Type', 'application/json');
        res.status(400).json({ errors });
    }
}

/**
 * Get a post by ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response containing the post or an error message.
 */
async function httpGetPostByID(req, res) {
    try {
        // Validate the provided post ID
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).json({ message: 'Invalid ID' });
        
        // Find the post by ID and populate related fields
        const post = await Post.findById(req.params.id)
            .select('title content author category image likes comments -_id')
            .populate({ path: 'author', select: 'username -_id' })
            .populate({ path: 'likes', select: 'username -_id' })

        // Handle if no post is found
        if (!post) return res.status(404).json({ message: 'No post found' });

        // Set the response headers and send the post
        res.header('Content-Type', 'application/json');
        res.status(200).json({ post });
    } catch (error) {
        console.error(error)
        const errors = handleError(error);

        // Set the response headers and handle validation errors or other errors
        res.header('Content-Type', 'application/json');
        res.status(400).json({ errors });
    }
}

/**
 * Get posts by category.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response containing the filtered posts or an error message.
 */
async function httpGetPostByCategory(req, res) {
    try {
        // Retrieve the category from the query parameters
        const { category } = req.query;

        // Format the category by trimming, 
        // replacing spaces with hyphens, and converting to lowercase
        let formattedCategory;
        if (category) {
            formattedCategory = category.trim().replace(/\s/g, '-').toLowerCase();
        }

        // Find posts matching the specified category and populate related fields
        const filteredPosts = await Post.find({ category: formattedCategory })
            .select('title content author category image likes comments')
            .populate({ path: 'author', select: 'username -_id' })
            .populate({ path: 'likes', select: 'username -_id' })
            .sort('-createdAt');
      
        // Handle if no posts are found for the specified category
        if (filteredPosts.length === 0) return res.status(404)
            .json({ message: `post with category ${category} not found` });

        // Set the response headers and send the filtered posts
        res.header('Content-Type', 'application/json');
        res.status(200).json({ filteredPosts });
    } catch (error) {
        const errors = handleError(error);

        // Set the response headers and handle validation errors or other errors
        res.header('Content-Type', 'application/json');
        res.status(400).json({ errors });
    }
}

/**
 * Get the count of posts.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response containing the count of posts or an error message.
 */
async function httpGetPostsCount(req, res) {
    try {
        // Count the number of posts
        const postsCount = await Post.countDocuments();

        // Handle if no posts are found
        if (postsCount === 0) return res.status(404).json({ message: 'No posts found' });

        // Set the response headers and send the posts count
        res.header('Content-Type', 'application/json');
        res.status(200).json({ postsCount });
    } catch (error) {
        const errors = handleError(error);

        // Set the response headers and handle validation errors or other errors
        res.header('Content-Type', 'application/json');
        res.status(400).json({ errors });
    }
}

/**
 * Create a new post.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response containing a success message or an error message.
 */
const httpCreatePost = async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const { _id } = req.user;

        // Find the user by ID
        const user = await User.findById(_id);

        // Handle if user is not found
        if (!user) return res.status(404).json({ message: 'user not found' });

        let formattedCategory;
        if (category) {
            // Format the category name
            formattedCategory = category.trim().replace(/\s/g, '-').toLowerCase();
        }

        // Check if the formatted category is specified but not found
        if (formattedCategory && !(await Cateory.findOne({ name: formattedCategory }))) {
            return res.status(404).json({ message: 'Category not found' });
        }

        let postImagePath = '';

        // Check if a file was uploaded and generate the postImagePath
        if (req.file) {
            const { filename } = req.file;
            postImagePath = `${req.protocol}://${req.get('host')}/public/uploads/${filename}`;
        }

        // Create the new post
        const createdPost = await Post.create({
            title,
            content,
            image: postImagePath,
            category: formattedCategory,
            author: _id,
        });

        // Handle if user is not modified
        if (!createdPost) return res.status(501).json({ message: 'post not implemented' });

        // Set the response headers and send the success message
        res.header('Content-Type', 'application/json');
        res.status(201).json({ message: `post created with ${createdPost._id}` });
    } catch (error) {
        const errors = handleError(error);

        // Set the response headers and handle validation errors or other errors
        res.header('Content-Type', 'application/json');
        res.status(400).json({ errors });
    }
}

/**
 * Update a post.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response indicating whether the post was updated or an error message.
 */
const httpUpdatePost = async (req, res) => {
    try {
        // Check if the post ID is valid
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).json({ message: 'Invaild ID' });
        
        const { _id } = req.user;

        // Find the current user
        const user = await User.findById(_id);
        if (!user) return res.status(404).json({ message: 'user not found' });
        
        // Find the post by ID and check if the current user is the author
        const post = await Post.findOne({ _id: req.params.id, author: _id });
        if (!post) return res.status(404).json({ message: 'You can\'t update this post' });

        let postImagePath = '';

        // Check if a file was uploaded and generate the postImagePath
        if (req.file) {
            const { filename } = req.file;
            postImagePath = `${req.protocol}://${req.get('host')}/public/uploads/${filename}`;
        }

        const { title, content, category } = req.body;

        // Validate the title length
        if (title && title.length > 100) {
            return res.status(400).json({message: 'title field must not exceed 100 characters'})
        }

        let formattedCategory
        if (category) {
            formattedCategory = category.trim().replace(/\s/g, '-').toLowerCase();
        }

        // Check if the formatted category exists
        if (formattedCategory && !(await Cateory.findOne({ name: formattedCategory }))) {
            return res.status(404).json({ message: 'category name not found' });
        }
    
        // Update the post
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            {
                title,
                content,
                category: formattedCategory,
                image: postImagePath
            },
            { new: true }
        );

        if (!updatedPost) return res.status(304).json({ message: 'Post not modified' })

        res.header('Content-Type', 'application/json');
        res.status(200).json({ message: `post with ID ${req.params.id} was updated` });
    } catch (error) {
        const errors = handleError(error);

        // Set the response headers and handle validation errors or other errors
        res.header('Content-Type', 'application/json');
        res.status(400).json({ errors });
    }
}

/**
 * Toggle like on a post.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response containing the updated post or an error message.
 */
async function httpToggleLike(req, res) {
    try {
        // Check if the post ID is valid
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).json({ error: 'Invalid ID' });
        
        const { _id } = req.user;
        const user = await User.findById(_id);
        if (!user) return res.status(404).json({ message: 'user not found' });

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        const likedIndex = post.likes.indexOf(_id);
        likedIndex === -1 ? post.likes.push(_id) : post.likes.splice(likedIndex, 1);
    
        await post.save();

        res.header('Content-Type', 'application/json');
        res.status(200).json({ post });
    } catch (error) {
        const errors = handleError(error);

        // Set the response headers and handle validation errors or other errors
        res.header('Content-Type', 'application/json');
        res.status(400).json({ errors });
    }
}

/**
 * Get the total number of likes on a post.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response containing the total likes count or an error message.
 */
async function httpGetTotalLikes(req, res) {
    try {
        // Check if the post ID is valid
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).json({ error: 'Invalid ID' });
        
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'No posts found' });

        const likesCount = post.likes;

        const totalLikes = likesCount.length;

        // Set the response headers and send the total likes count
        res.header('Content-Type', 'application/json');
        res.status(200).json({ totalLikes });
    } catch (error) {
        const errors = handleError(error);

        // Set the response headers and handle validation errors or other errors
        res.header('Content-Type', 'application/json');
        res.status(400).json({ errors });
    }
}


/**
 * Delete a post.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response containing a success message or an error message.
 */
const httpDeletePost = async (req, res) => {
    try {
        // Retrieve the user ID from the request object
        const { _id } = req.user;

        // Validate the provided post ID
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).json({ message: 'Invalid ID' });
        
        // Find the user and handle if user not found
        const user = await User.findById(_id);
        if (!user) return res.status(404).json({ message: 'user not found' });

        // Find the post by ID and author
        const post = await Post.findOne({ _id: req.params.id, author: _id });
        if (!post) return res.status(404).json({ message: 'post not found' });

        // Delete the post
        const deletedPost = await Post.findByIdAndDelete(post._id);

        // Handle if the post was not deleted
        if (deletedPost.deletedCount === 0) return res.status(417)
            .json({ message: 'Expectation Failed' });

        // Set the response headers and send the success message
        res.header('Content-Type', 'application/json');
        res.status(200).json({ message: `post with ID ${req.params.id} was deleted` });
    } catch (error) {
        const errors = handleError(error);

        // Set the response headers and handle validation errors or other errors
        res.header('Content-Type', 'application/json');
        res.status(400).json({ errors });
    }
}

module.exports = {
    httpGetPosts,
    httpGetPostByID,
    httpGetPostByCategory,
    httpGetPostsCount,
    httpCreatePost,
    httpUpdatePost,
    httpToggleLike,
    httpGetTotalLikes,
    httpDeletePost,
};