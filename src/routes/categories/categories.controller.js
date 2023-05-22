const mongoose = require('mongoose');

const Category = require('../../models/categories.model');
const handleError = require('../../utils/errors.handler');

/**
 * Get all categories.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response containing the categories or an error message.
 */
const httpGetCategories = async (req, res) => {
    try {
        const categories = await Category.find({})
            .select('name')
            .sort('-createdAt');
      
        // Handle if no categories are found
        if (categories.length === 0) return res.status(404)
            .json({ message: 'No categories found' });

        // Set the response headers and send the categories
        res.header('Content-Type', 'application/json');
        res.status(200).json({ categories });
    } catch (error) {
        const errors = handleError(error);

        // Set the response headers and handle validation errors or other errors
        res.header('Content-Type', 'application/json');
        res.status(400).json({ errors });
    }
}

/**
 * Get a category by ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response containing the category or an error message.
 */
async function httpGetCategoryByID(req, res) {
    try {
        // Validate the ID parameter
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).json({ message: 'Invalid ID' });
        
        // Find the category by ID
        const category = await Category.findById(req.params.id)
            .select('-_id -__v');

        // Handle if category is not found
        if (!category) return res.status(404)
            .json({ message: `category with ID ${req.params.id} not found` });

        // Set the response headers and send the category
        res.header('Content-Type', 'application/json');
        res.status(200).json({ category });
    } catch (error) {
        const errors = handleError(error);

        // Set the response headers and handle validation errors or other errors
        res.header('Content-Type', 'application/json');
        res.status(400).json({ errors });
    }
}

/**
 * Create a new category.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response containing the success message or an error message.
 */
const httpCreateCategory = async (req, res) => {
    try {
        const { name } = req.body;

        // Validate that a category name is provided
        if (!name) return res.status(400).json({ message: 'Please provide a category name' });

        // Create the category
        const category = await Category.create({ name });

        // Handle if category creation is not implemented
        if (!category) return res.status(501)
            .json({ message: 'category creation was not implemented' })

        // Set the response headers and send the success message
        res.header('Content-Type', 'application/json');
        res.status(201).json({ message: `category created with ID ${category._id}` });
    } catch (error) {
        const errors = handleError(error);

        // Set the response headers and handle validation errors or other errors
        res.header('Content-Type', 'application/json');
        res.status(400).json({ errors });
    }
}

/**
 * Update a category by ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response containing the success message or an error message.
 */
const httpUpdateCategory = async (req, res) => {
    try {
        // Validate the ID parameter
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).json({ message: 'Invalid ID' });
        
        const { name } = req.body;

        // Validate that a category name is provided
        if (!name) return res.status(400).json({ message: 'Please provide a category name' });

        // Format the name by removing whitespace and converting to lowercase
        const formattedName = name.trim().replace(/\s/g, '-').toLowerCase();

        // Check if the name already exists for another use
        if (formattedName === await Category.findOne({ name: formattedName })) {
            return res.status(400).json({ message: 'category name already exists, choose a different name' });
        }

        // Check if the category exists
        const existedCategory = await Category.find({ _id: req.params.id });

        // Handle if the category is not found
        if (existedCategory.length === 0) return res.status(404)
            .json({ message: `category with ID ${req.params.id} not found` });

        // Update the category by ID
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true }
        );

        // Handle if the category is not modified
        if (!category) return res.status(304)
            .json({ message: `category with ID ${req.params.id} not modified` });

        // Set the response headers and send the success message
        res.header('Content-Type', 'application/json');
        res.status(200).json({ message: `category with ID ${req.params.id} was modified` });
    } catch (error) {
        const errors = handleError(error);

        // Set the response headers and handle validation errors or other errors
        res.header('Content-Type', 'application/json');
        res.status(400).json({ errors });
    }
}

/**
 * Delete a category by ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response containing the success message or an error message.
 */
const httpDeleteCategory = async (req, res) => {
    try {
        // Validate the ID parameter
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).json({ message: 'Invalid ID' });
        
        // Check if the category exists
        const existedCategory = await Category.find({ _id: req.params.id });

        // Handle if the category is not found
        if (existedCategory.length === 0) return res.status(404)
            .json({ message: `category with ID ${req.params.id} not found` });

        // Delete the category by ID
        const cateory = await Category.findByIdAndDelete(req.params.id );

        // Handle if the category is not deleted
        if (cateory.deletedCount === 0) return res.status(417)
            .json({ message: 'Expectation Failed' });

        // Set the response headers and send the success message
        res.header('Content-Type', 'application/json');
        res.status(200).json({ message: `category with ID ${req.params.id} was deleted` });
    } catch (error) {
        const errors = handleError(error);

        // Set the response headers and handle validation errors or other errors
        res.header('Content-Type', 'application/json');
        res.status(400).json({ errors });
    }
}

module.exports = {
    httpGetCategories,
    httpGetCategoryByID,
    httpCreateCategory,
    httpUpdateCategory,
    httpDeleteCategory,
};