import express, { Router } from "express";
import QuestionAndAnswerController from "./question.controller";

const router: Router = express.Router();
const QandA = new QuestionAndAnswerController();

router.post("/create-message", QandA.createMessage);
router.get("/messages/:id", QandA.getMessages);
router.get("/messaged-users/:id", QandA.getMessagedUsers);

export default router;
