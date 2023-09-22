import express, { Router } from "express";
import Category from "./category.controller";

const router: Router = express.Router();
const category = new Category();

router.post("/create", category.create);

router.get("/category/:id", category.category);
router.get("/categories", category.categories);

router.put("/update-category/:id", category.update);

router.delete("/delete-category/:id", category.deleteCategory);

export default router;
