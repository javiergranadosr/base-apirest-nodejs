const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio."],
  },
  email: {
    type: String,
    required: [true, "El email es obligatorio."],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "El password es obligatorio."],
  },
  image: {
    type: String,
  },
  rol: {
    type: String,
    required: true,
    enum: ["ADMIN_ROLE", "USER_ROLE", "SALE_ROLE"],
  },
  status: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

UserSchema.methods.toJSON = function() {
  const {__v, password,_id,  ...user} = this.toObject(); // Eliminamos __v y password del modelo user
  user.uid = _id;
  return user;
} 


module.exports = model("User", UserSchema);
