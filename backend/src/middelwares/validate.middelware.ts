import { type Request,type Response } from 'express';
import {z} from "zod"

export const validate = (schema: z.ZodTypeAny) => {
  return async (req: Request, res: Response, next: any): Promise<void> => {
    try {
      // This forces Zod to check req.body, req.query, and req.params
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next(); 
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          errors: error.issues.map(err => ({
            field: err.path[1] || err.path[0], 
            message: err.message
          }))
        });
        return;
      }
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
};