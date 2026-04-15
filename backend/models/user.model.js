import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    cartItems: { type: Object, default: {} },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    gender: { type: String, default: "" },
  },
  { minimize: false }
);

const User = mongoose.model("User", userSchema);
export default User;
