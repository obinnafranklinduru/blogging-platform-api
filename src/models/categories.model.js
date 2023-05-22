const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        unique: [true, 'category already exists'],
        lowercase: true,
        trim: true,
        set: value => {
            if (value) return value.replace(/\s/g, '-');
            return value;
        },
    },
}, { timestamps: true });

module.exports = mongoose.model("Category", CategorySchema);