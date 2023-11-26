import express, { Router } from "express";
import MailController from "./mail.controller";

const router: Router = express.Router();
const mail = new MailController();

router.post("/send-mails", mail.sendMail);
// template routes
router.post("/create-template", mail.createTemplate);
router.get("/templates", mail.templates);
router.put("/update-template/:id", mail.updateTemplate);
router.delete("/delete-template/:id", mail.deleteTemplate);
// contact form routes
router.post("/contact-form", mail.contactForm);
// subscription routes
router.post("/subscribe", mail.subscribe);
router.get("/subscribers", mail.subsribers);

export default router;
