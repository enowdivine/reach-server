import express, { Router } from "express";
import MailController from "./mail.controller";

const router: Router = express.Router();
const mail = new MailController();

router.post("/send-mails", mail.sendMail);

router.post("/create-template", mail.createTemplate);
router.get("/templates", mail.templates);
router.put("/update-twmplate/:id", mail.updateTemplate);
router.delete("/delete-template/:id", mail.deleteTemplate);

export default router;
