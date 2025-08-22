import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

// # userSchema
const userSchema = Schema(
  {
    displayName: {
      type: String,
      required: true,
    },
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      familyName: {
        type: String,
        required: true,
      },
      givenName: {
        type: String,
        required: true,
      },
    },
    photos: [
      {
        type: String,
      },
    ],
    provider: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
      unique: true, // Safety check
    },
  },
  { timestamps: true }
);

export default model("User", userSchema);
