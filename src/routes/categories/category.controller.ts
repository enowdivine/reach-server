import { Request, Response } from "express";
import Category from "./category.model";

class CategoryController {
  async create(req: Request, res: Response) {
    try {
      const course = new Category({ title: req.body.title });
      await course
        .save()
        .then(() => {
          res.status(201).json({
            message: "category created",
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "error creating category",
            error: err,
          });
        });
    } catch (error) {
      console.error("error creating chapter", error);
    }
  }

  async category(req: Request, res: Response) {
    try {
      const category = await Category.findOne({ _id: req.params.id });
      if (category) {
        return res.status(200).json({
          category,
        });
      } else {
        return res.status(404).json({
          message: "category not found",
        });
      }
    } catch (error) {
      console.error("error fetching category", error);
    }
  }

  async categories(req: Request, res: Response) {
    try {
      const categories = await Category.find().sort({ createdAt: -1 });
      if (categories) {
        return res.status(200).json({
          categories,
        });
      } else {
        return res.status(404).json({
          message: "no categories found",
        });
      }
    } catch (error) {
      console.error("error fetching categories", error);
    }
  }

  async update(req: Request, res: Response) {
    const lesson = await Category.updateOne(
      {
        _id: req.params.id,
      },
      {
        $set: {
          title: req.body.title,
        },
      }
    );
    if (lesson.acknowledged) {
      res.status(200).json({
        message: "update successful",
      });
    } else {
      res.status(404).json({
        message: "category not found",
      });
    }
  }

  async deleteCategory(req: Request, res: Response) {
    try {
      const response = await Category.deleteOne({ _id: req.params.id });
      if (response.deletedCount > 0) {
        res.status(200).json({
          message: "category deleted",
        });
      } else {
        res.status(404).json({
          message: "category not found",
        });
      }
    } catch (error) {
      console.error("error deleting category", error);
    }
  }
}

export default CategoryController;
