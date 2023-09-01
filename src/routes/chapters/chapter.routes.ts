import express, { Router } from "express";
import Chapter from "./chapter.controller";

const router: Router = express.Router();
const chapter = new Chapter();

router.post("/create", chapter.create);

router.get("/chapter/:id", chapter.chapter);
router.get("/chapters/:courseId", chapter.chapters);

router.put("/update-chapter/:id", chapter.update);

router.delete("/delete-chapter/:id", chapter.deleteChapter);

export default router;
