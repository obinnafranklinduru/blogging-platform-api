const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    default: '',
    maxlength: [32, 'firstname field must not exceed 32 characters'],
  },
  surname: {
    type: String,
    default: '',
    maxlength: [32, 'surname field must not exceed 32 characters'],
  },
  username: {
    type: String,
    required: [true, 'username is required'],
    maxlength: [20, 'username field must not exceed 20 characters'],
    unique: [true, 'username already exists'],
    lowercase: true,
    trim: true,
    set: value => {
      if (value) return value.replace(/\s/g, '');
      return value;
    },
  },
  email: {
    type: String,
    required: [true, 'email address is required'],
    unique: [true, 'email address already exists'],
    lowercase: true,
    trim: true,
    validate: [isEmail, 'invalid email address'],
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    trim: true,
    minlength: [6, 'enter at least 6 characters'],
  },
  profilePicture: {
    type: String,
    default: '',
  },
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });


userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error) {
    console.error(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;