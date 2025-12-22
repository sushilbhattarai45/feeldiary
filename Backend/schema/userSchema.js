import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateOfJoining: {
    type: Date,
    default: Date.now,
  },
  languages: {
    type: Array,
    default: [],
  },
  favoriteArtists: {
    type: Array,
    default: [],
  },
});

export default mongoose.model("User", userSchema);
