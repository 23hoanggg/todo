import mongoose, { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  avatarUrl: string;
  fullName: string;
  email: string;
  password: string;
  role: "user" | "admin";
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    avatarUrl: { type: String, default: "" },
    fullName: {
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
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model<IUser>("user", userSchema);
export default User;
