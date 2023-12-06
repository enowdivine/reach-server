import { Request, Response } from "express";
import Job from "./job.model";

class JobController {
  async create(req: Request, res: Response) {
    try {
      const job = new Job({
        clientId: req.body.clientId,
        title: req.body.title,
        skills: req.body.skills,
        scope: req.body.scope,
        duration: req.body.duration,
        experienceLevel: req.body.experienceLevel,
        jobType: req.body.jobType,
        jobLocation: req.body.jobLocation,
        budget: req.body.budget,
        desription: req.body.desription,
        company: req.body.company,
      });
      await job
        .save()
        .then(() => {
          res.status(201).json({
            message: "job sent",
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "error sending job",
            error: err,
          });
        });
    } catch (error) {
      console.error("error sending job", error);
    }
  }

  async read(req: Request, res: Response) {
    try {
      const job = await Job.find({ _id: req.params.id });
      if (job) {
        return res.status(200).json(job);
      } else {
        return res.status(404).json({
          message: "no job found",
        });
      }
    } catch (error) {
      console.error("error fetching job", error);
    }
  }

  async reads(req: Request, res: Response) {
    try {
      const jobs = await Job.find({});
      if (jobs) {
        return res.status(200).json(jobs);
      } else {
        return res.status(404).json({
          message: "no job found",
        });
      }
    } catch (error) {
      console.error("error fetching jobs", error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updatedjob = await Job.updateOne(
        {
          _id: req.params.id,
        },
        {
          $set: {
            title: req.body.title,
            skills: req.body.skills,
            scope: req.body.scope,
            duration: req.body.duration,
            experienceLevel: req.body.experienceLevel,
            jobType: req.body.jobType,
            jobLocation: req.body.jobLocation,
            budget: req.body.budget,
            desription: req.body.desription,
            company: req.body.company,
          },
        }
      );
      if (updatedjob.acknowledged) {
        res.status(200).json({
          message: "update successful",
        });
      } else {
        res.status(404).json({
          message: "job not found",
        });
      }
    } catch (error) {
      console.error("error updating job", error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const response = await Job.deleteOne({ _id: req.params.id });
      if (response.deletedCount > 0) {
        res.status(200).json({
          message: "job deleted",
        });
      } else {
        res.status(404).json({
          message: "job not found",
        });
      }
    } catch (error) {
      console.error("error deleting job", error);
    }
  }
}

export default JobController;
