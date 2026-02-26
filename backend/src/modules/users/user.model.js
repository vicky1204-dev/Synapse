import mongoose, { Schema } from "mongoose";
import argon2 from "argon2";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    about: String,
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "moderator", "admin"],
    },
    department: String,
    skills: [
      {
        type: String,
      },
    ],
    level: Number,
    badges: [
      {
        type: String,
      },
    ],
    isMuted: {
      type: Boolean,
      default: false,
    },
    muteUntil: {
      type: Date,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: "",
    },
    emailVerificationExpiry: {
      type: Date,
    },
    forgotPasswordToken: {
      type: String,
      default: "",
    },
    forgotPasswordTokenExpiry: {
      type: Date,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function(){
    if(!this.isModified("password")) return;
    this.password = await argon2.hash(this.password)
})

userSchema.methods.checkPassword = async function (clientPassword) {
    return argon2.verify(this.password, clientPassword)
}

export const User = mongoose.model("User", userSchema);
