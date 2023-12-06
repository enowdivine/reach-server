import express, { Router } from "express";
import Experience from "./exp.controller";

const router: Router = express.Router();
const exp = new Experience();

router.post("/create", exp.create);

router.get("/experience/:id", exp.read);
router.get("/experiences/:id", exp.reads);

router.put("/update-experience/:id", exp.update);

router.delete("/delete-experience/:id", exp.delete);

export default router;
