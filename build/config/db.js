"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
require("dotenv").config();
// DATABASE CONNECTION
const dbConnect = () => {
    mongoose
        .connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => console.log("Database connected 🔥 !!"))
        .catch((err) => console.log(err));
};
exports.default = dbConnect;
