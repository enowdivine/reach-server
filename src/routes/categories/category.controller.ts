import { Request, Response } from "express";
import Category from "./category.model";
import slugify from "../../helpers/slugify";

class CategoryController {
  async create(req: Request, res: Response) {
    try {
      const slug = slugify(req.body.title);
      const cat = await Category.findOne({ slug: slug });
      if (cat) {
        return res.status(409).json({
          message: "category already exist",
        });
      }
      const category = new Category({ title: req.body.title, slug: slug });
      await category
        .save()
        .then((response) => {
          res.status(201).json({
            message: "category created",
            response,
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
    const slug = slugify(req.body.title);
    const category = await Category.updateOne(
      {
        _id: req.params.id,
      },
      {
        $set: {
          title: req.body.title,
          slug: slug,
        },
      }
    );
    if (category.acknowledged) {
      const updated = await Category.findOne({ _id: req.params.id });
      res.status(200).json({
        message: "update successful",
        updated,
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
          response: {
            id: req.params.id,
            response,
          },
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
