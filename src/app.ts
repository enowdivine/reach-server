import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser = require("body-parser");
import dbConnect from "./config/db";
import http from "http";
import cors from "cors";

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

dotenv.config();
const app = express();
dbConnect();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Deonicode Server 🚀");
});

const PORT: any = process.env.PORT || 5000;
const server: any = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}, HURRAY!!!!!`);
});
