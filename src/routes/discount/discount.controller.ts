import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Discount from "./discount.model";
import instructorModel from "../instructor/instructor.model";
import userModel from "../user/user.model";
import sendEmail from "../../services/email/sendEmail";
import { discountMail } from "./templates/mails";

class MailController {
  async createDiscount(req: Request, res: Response) {
    try {
      const expiryDate = new Date(
        new Date().getTime() + req.body.duration * 24 * 60 * 60 * 1000
      );
      const token: string = jwt.sign(
        {
          amount: req.body.amount,
          expiryDate,
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: `${req.body.duration}d`,
        }
      );

      const discount = new Discount({
        amount: req.body.amount,
        expiresIn: expiryDate,
        token,
      });

      await discount
        .save()
        .then(async (response) => {
          const instructors = await instructorModel.find({});
          const users = await userModel.find({});
          if (instructors.length > 0 && users.length > 0) {
            instructors.map((item) => {
              return sendEmail({
                to: item.email as string,
                subject: "New Discount Rate",
                message: discountMail(item.username as string, req.body.amount),
              });
            });
            users.map((item) => {
              return sendEmail({
                to: item.email as string,
                subject: "New Discount Rate",
                message: discountMail(item.username as string, req.body.amount),
              });
            });
            res.status(201).json({
              message: "discount created",
              response,
            });
          } else {
            res.status(400).json({
              message: "error sending mails",
            });
          }
        })
        .catch((err) => {
          res.status(500).json({
            message: "error creating discount",
            error: err,
          });
        });
    } catch (error) {
      console.error("error creating discount", error);
    }
  }

  async discount(req: Request, res: Response) {
    try {
      const discount = await Discount.find({}).sort({ createdAt: -1 });
      if (discount) {
        res.status(200).json(discount[0]);
      } else {
        res.status(404).json({
          message: "discount not found",
        });
      }
    } catch (error) {
      console.error("error fetching discount", error);
    }
  }

  async updateDiscount(req: Request, res: Response) {
    const expiryDate = new Date(
      new Date().getTime() + req.body.duration * 24 * 60 * 60 * 1000
    );
    const token: string = jwt.sign(
      {
        amount: req.body.amount,
        expiryDate,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: `${req.body.duration}d`,
      }
    );

    const discount = await Discount.updateOne(
      {
        _id: req.params.id,
      },
      {
        $set: {
          amount: req.body.amount,
          expiresIn: expiryDate,
          token,
        },
      }
    );
    if (discount.acknowledged) {
      const response = await Discount.find({}).sort({ createdAt: -1 });
      res.status(200).json({
        message: "update successful",
        response,
      });
    } else {
      res.status(404).json({
        message: "discount not found",
      });
    }
  }

  async deleteDiscount(req: Request, res: Response) {
    try {
      const response = await Discount.deleteOne({ _id: req.params.id });
      if (response.deletedCount > 0) {
        res.status(200).json({
          message: "discount deleted",
        });
      } else {
        res.status(404).json({
          message: "discount not found",
        });
      }
    } catch (error) {
      console.error("error deleting discount", error);
    }
  }
}

export default MailController;
