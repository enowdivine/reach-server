import express, { Router } from "express";
import Education from "./edu.controller";

const router: Router = express.Router();
const edu = new Education();

router.post("/create", edu.create);

router.get("/education/:id", edu.read);
router.get("/educations/:id", edu.reads);

router.put("/update-education/:id", edu.update);

router.delete("/delete-education/:id", edu.delete);

export default router;
