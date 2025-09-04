import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

/**
 * Middleware factory nhận vào một schema của Zod để validation.
 * @param schema Schema của Zod để kiểm tra (kiểu là z.Schema).
 */
export const validate =
  (schema: z.Schema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Dữ liệu đầu vào không hợp lệ.",
          errors: error.issues.map((issue) => ({
            path: issue.path,
            message: issue.message,
          })),
        });
      }
      next(error);
    }
  };
