import express, { Request, Response } from "express";
import bodyParser = require("body-parser");
import dbConnect from "./config/db";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
// api imports
import userRoutes from "./routes/user/user.routes";
import adminRoutes from "./routes/admin/admin.routes";
import courseRoutes from "./routes/courses/course.routes";
import lessonRoutes from "./routes/lessons/lesson.routes";
import chapterRoutes from "./routes/chapters/chapter.routes";
import categoryRoutes from "./routes/categories/category.routes";
import instructorRoutes from "./routes/instructor/instructor.routes";
import transactionRoutes from "./routes/transactions/transaction.routes";
import questionsRoutes from "./routes/questionsAndAnswers/question.routes";

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
app.use(`/api/${process.env.API_VERSION}/user`, userRoutes);
app.use(`/api/${process.env.API_VERSION}/admin`, adminRoutes);
app.use(`/api/${process.env.API_VERSION}/course`, courseRoutes);
app.use(`/api/${process.env.API_VERSION}/lesson`, lessonRoutes);
app.use(`/api/${process.env.API_VERSION}/chapter`, chapterRoutes);
app.use(`/api/${process.env.API_VERSION}/q-and-a`, questionsRoutes);
app.use(`/api/${process.env.API_VERSION}/category`, categoryRoutes);
app.use(`/api/${process.env.API_VERSION}/instructor`, instructorRoutes);
app.use(`/api/${process.env.API_VERSION}/transaction`, transactionRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Deonicode Server 🚀");
});

const PORT: any = process.env.PORT || 5000;
const server: any = http.createServer(app);
server.listen(PORT, () => {
  console.log(`server listening on port ${PORT}, 🚀`);
});
