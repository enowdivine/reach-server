import { Request, Response } from "express";
import Edu from "./edu.model";

class EduController {
  async create(req: Request, res: Response) {
    try {
      const education = new Edu({
        userId: req.body.userId,
        school: req.body.school,
        graduationYear: req.body.graduationYear,
        degree: req.body.degree,
        fieldOfStudy: req.body.fieldOfStudy,
      });
      await education
        .save()
        .then((response) => {
          res.status(201).json({
            message: "education created",
            education: response,
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "error creating education",
            error: err,
          });
        });
    } catch (error) {
      console.error("error creating chapter", error);
    }
  }

  async read(req: Request, res: Response) {
    try {
      const education = await Edu.findOne({ _id: req.params.id });
      if (education) {
        return res.status(200).json(education);
      } else {
        return res.status(404).json({
          message: "education not found",
        });
      }
    } catch (error) {
      console.error("error fetching education", error);
    }
  }

  async reads(req: Request, res: Response) {
    try {
      const educations = await Edu.find({ _id: req.params.id });
      if (educations) {
        return res.status(200).json(educations);
      } else {
        return res.status(404).json({
          message: "no educations found",
        });
      }
    } catch (error) {
      console.error("error fetching educations", error);
    }
  }

  async update(req: Request, res: Response) {
    const education = await Edu.updateOne(
      {
        _id: req.params.id,
      },
      {
        $set: {
          school: req.body.school,
          graduationYear: req.body.graduationYear,
          degree: req.body.degree,
          fieldOfStudy: req.body.fieldOfStudy,
        },
      }
    );
    if (education.acknowledged) {
      const updated = await Edu.findOne({ _id: req.params.id });
      res.status(200).json({
        message: "update successful",
        education: updated,
      });
    } else {
      res.status(404).json({
        message: "education not found",
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const response = await Edu.deleteOne({ _id: req.params.id });
      if (response.deletedCount > 0) {
        res.status(200).json({
          message: "education deleted",
          returnedId: req.params.id,
        });
      } else {
        res.status(404).json({
          message: "education not found",
        });
      }
    } catch (error) {
      console.error("error deleting education", error);
    }
  }
}

export default EduController;
