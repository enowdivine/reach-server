import { Request, Response } from "express";
import Exp from "./exp.model";

class ExpController {
  async create(req: Request, res: Response) {
    try {
      const experience = new Exp({
        userId: req.body.userId,
        title: req.body.title,
        company: req.body.company,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        isPresent: req.body.isPresent,
        companyWebsite: req.body.companyWebsite,
      });
      await experience
        .save()
        .then((response) => {
          res.status(201).json({
            message: "experience created",
            experience: response,
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "error creating experience",
            error: err,
          });
        });
    } catch (error) {
      console.error("error creating chapter", error);
    }
  }

  async read(req: Request, res: Response) {
    try {
      const experience = await Exp.findOne({ _id: req.params.id });
      if (experience) {
        return res.status(200).json(experience);
      } else {
        return res.status(404).json({
          message: "experience not found",
        });
      }
    } catch (error) {
      console.error("error fetching experience", error);
    }
  }

  async reads(req: Request, res: Response) {
    try {
      const experiences = await Exp.find().sort({ createdAt: -1 });
      if (experiences) {
        return res.status(200).json(experiences);
      } else {
        return res.status(404).json({
          message: "no experiences found",
        });
      }
    } catch (error) {
      console.error("error fetching experiences", error);
    }
  }

  async update(req: Request, res: Response) {
    const experience = await Exp.updateOne(
      {
        _id: req.params.id,
      },
      {
        $set: {
          title: req.body.title,
          company: req.body.company,
          description: req.body.description,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          isPresent: req.body.isPresent,
          companyWebsite: req.body.companyWebsite,
        },
      }
    );
    if (experience.acknowledged) {
      const updated = await Exp.findOne({ _id: req.params.id });
      res.status(200).json({
        message: "update successful",
        experience: updated,
      });
    } else {
      res.status(404).json({
        message: "experience not found",
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const response = await Exp.deleteOne({ _id: req.params.id });
      if (response.deletedCount > 0) {
        res.status(200).json({
          message: "experience deleted",
          returnedId: req.params.id,
        });
      } else {
        res.status(404).json({
          message: "experience not found",
        });
      }
    } catch (error) {
      console.error("error deleting experience", error);
    }
  }
}

export default ExpController;
