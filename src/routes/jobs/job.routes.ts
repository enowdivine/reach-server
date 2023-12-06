import express, { Router } from "express";
import Job from "./job.controller";

const router: Router = express.Router();
const job = new Job();

router.post("/post-job", job.create);

router.get("/job/:id", job.read);
router.get("/jobs", job.reads);

router.put("/update-job/:id", job.update);
router.delete("/delete-job/:id", job.delete);

export default router;
