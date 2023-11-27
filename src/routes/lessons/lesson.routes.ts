import express, { Router } from "express";
import Lesson from "./lesson.controller";
import { upload } from "../../middleware/s3/s3";

const router: Router = express.Router();
const lesson = new Lesson();

router.post("/create", upload.single("lessonVideo"), lesson.create);
router.post("/create-loom-lesson", lesson.createLoomLesson);

router.get("/lesson/:id", lesson.lesson);
router.get("/lessons/:chapId", lesson.lessons);

router.put("/update-lesson/:id", upload.single("lessonVideo"), lesson.update);

router.delete("/delete-lesson/:id", lesson.deleteLesson);

export default router;
