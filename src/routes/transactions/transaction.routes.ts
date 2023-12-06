import express, { Router } from "express";
import Transaction from "./transaction.controller";

const router: Router = express.Router();
const transaction = new Transaction();

// router.post("/create", transaction.create);

router.get("/transaction/:id", transaction.transaction);
router.get("/transactions/:instructorId", transaction.instructorTransaction);
router.get("/transactions", transaction.transactions);

export default router;
