import express, { Router } from "express";
import Lesson from "./lesson.controller";

const router: Router = express.Router();
const lesson = new Lesson();

router.post("/create", lesson.create);

router.get("/lesson/:id", lesson.lesson);
router.get("/lessons/:chapId", lesson.lessons);

router.put("/update-lesson/:id", lesson.update);

router.delete("/delete-lesson/:id", lesson.deleteLesson);

export default router;
