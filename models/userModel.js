import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = mongoose.Schema(
  {
    name: { type: "String", required: true },
    email: { type: "String", unique: true, required: true },
    password: { type: "String", required: true },
    pic: {
      type: "String",
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpaTTohNZ3rp44K7dWEeDsrLtFx-n23eZPjZLvf7Sx_CoOvLAgLVmKTrV4nbrH1xugAqc&usqp=CAU",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// userSchema.pre("save", async function (next) {
//   if (!this.isModified) {
//     next();
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });
const generateAuthToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY);
};

export const User = mongoose.model("User", userSchema);
export { generateAuthToken };
