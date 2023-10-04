import express, { Router } from "express";
import QuestionAndAnswerController from "./question.controller";

const router: Router = express.Router();
const QandA = new QuestionAndAnswerController();

router.post("/create-message", QandA.createQuestion);
router.get("/questions/:userId/:courseId", QandA.getQuestions);
router.get("/questions-users/:id", QandA.getQuestionsUsers);

export default router;
