const mongoose = require("mongoose");
const validator = require("validator"); // Recuerda: npm install validator

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Jacques Cousteau",
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Explorador",
  },
  avatar: {
    type: String,
    default:
      "https://practicum-content.s3.us-west-1.amazonaws.com/resources/moved_avatar_1604080799.jpg",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "Formato de email incorrecto",
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // Protege la contraseña
  },
});

module.exports = mongoose.model("user", userSchema);
