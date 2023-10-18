import express, { Router } from "express";
import DiscountController from "./discount.controller";

const router: Router = express.Router();
const discount = new DiscountController();

router.post("/create-discount", discount.createDiscount);
router.get("/discount", discount.discount);
router.put("/update-discount/:id", discount.updateDiscount);
router.delete("/delete-discount/:id", discount.deleteDiscount);

export default router;
