import { Request, Response } from "express";
import MailTemplate from "./mail.model";
import instructorModel from "../instructor/instructor.model";
import userModel from "../user/user.model";
import sendEmail from "../../services/email/sendEmail";
import { generalMail } from "./templates/mails";

class MailController {
  async createTemplate(req: Request, res: Response) {
    try {
      const template = new MailTemplate({
        title: req.body.title,
        message: req.body.message,
      });
      await template
        .save()
        .then(() => {
          res.status(201).json({
            message: "template created",
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "error creating template",
            error: err,
          });
        });
    } catch (error) {
      console.error("error creating template", error);
    }
  }

  async templates(req: Request, res: Response) {
    try {
      const templates = await MailTemplate.find({}).sort({ createdAt: -1 });
      if (templates) {
        return res.status(200).json(templates);
      } else {
        return res.status(404).json({
          message: "no template found",
        });
      }
    } catch (error) {
      console.error("error fetching templates", error);
    }
  }

  async updateTemplate(req: Request, res: Response) {
    const lesson = await MailTemplate.updateOne(
      {
        _id: req.params.id,
      },
      {
        $set: {
          title: req.body.title,
          message: req.body.message,
        },
      }
    );
    if (lesson.acknowledged) {
      res.status(200).json({
        message: "update successful",
      });
    } else {
      res.status(404).json({
        message: "template not found",
      });
    }
  }

  async deleteTemplate(req: Request, res: Response) {
    try {
      const response = await MailTemplate.deleteOne({ _id: req.params.id });
      if (response.deletedCount > 0) {
        res.status(200).json({
          message: "template deleted",
        });
      } else {
        res.status(404).json({
          message: "template not found",
        });
      }
    } catch (error) {
      console.error("error deleting template", error);
    }
  }

  async sendMail(req: Request, res: Response) {
    try {
      const targetAudience = req.body.targetAudience;
      if (targetAudience === "users") {
        const users = await userModel.find({});
        if (users.length > 0) {
          users.map((item) => {
            return sendEmail({
              to: item.email as string,
              subject: req.body.subject,
              message: generalMail(item.username as string, req.body.message),
            });
          });
          res.status(200).json({
            message: "Mails sent successfully",
          });
        } else {
          res.status(400).json({
            message: "error sending mails",
          });
        }
      }
      if (targetAudience === "instructors") {
        const instructors = await instructorModel.find({});
        if (instructors.length > 0) {
          instructors.map((item) => {
            return sendEmail({
              to: item.email as string,
              subject: req.body.subject,
              message: generalMail(item.username as string, req.body.message),
            });
          });
          res.status(200).json({
            message: "Mails sent successfully",
          });
        } else {
          res.status(400).json({
            message: "error sending mails",
          });
        }
      }
      if (targetAudience === "everyone") {
        const instructors = await instructorModel.find({});
        const users = await userModel.find({});
        if (instructors.length > 0 && users.length > 0) {
          instructors.map((item) => {
            return sendEmail({
              to: item.email as string,
              subject: req.body.subject,
              message: generalMail(item.username as string, req.body.message),
            });
          });
          users.map((item) => {
            return sendEmail({
              to: item.email as string,
              subject: req.body.subject,
              message: generalMail(item.username as string, req.body.message),
            });
          });
          res.status(200).json({
            message: "Mails sent successfully",
          });
        } else {
          res.status(400).json({
            message: "error sending mails",
          });
        }
      }
    } catch (error) {
      console.error("error creating template", error);
    }
  }
}

export default MailController;
