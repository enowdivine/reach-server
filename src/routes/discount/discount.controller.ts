import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Discount from "./discount.model";
import instructorModel from "../instructor/instructor.model";
import userModel from "../user/user.model";
import sendEmail from "../../services/email/sendEmail";
// import { generalMail } from "./templates/mails";

class MailController {
  async createDiscount(req: Request, res: Response) {
    try {
      const token: string = jwt.sign(
        {
          amount: req.body.amount,
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: `${req.body.duration}d`,
        }
      );
      const discount = new Discount({
        title: req.body.title,
        token,
      });
      await discount
        .save()
        .then(() => {
          res.status(201).json({
            message: "discount created",
          });
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

  async discount(res: Response) {
    try {
      const discount = await Discount.find({}).sort({ createdAt: -1 });
      if (discount) {
        return res.status(200).json(discount[0]);
      } else {
        return res.status(404).json({
          message: "discount not found",
        });
      }
    } catch (error) {
      console.error("error fetching discount", error);
    }
  }

  async updateDiscount(req: Request, res: Response) {
    const token: string = jwt.sign(
      {
        amount: req.body.amount,
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
          title: req.body.title,
          token,
        },
      }
    );
    if (discount.acknowledged) {
      res.status(200).json({
        message: "update successful",
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
