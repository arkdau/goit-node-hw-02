// import mongoose from "mongoose";
const { mongoose } = require("mongoose");
const BlacklistSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
            ref: "User",
        },
    },
    { timestamps: true }
);
// export default mongoose.model("blacklist", BlacklistSchema);

module.exports = mongoose.model("blacklist", BlacklistSchema);













