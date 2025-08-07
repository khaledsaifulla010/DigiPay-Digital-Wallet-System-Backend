import { Request, Response } from "express";
import httpStatus from "http-status-codes";
const NotFoundRoute = (req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    sucess: false,
    message: "Route Not Found!",
  });
};

export default NotFoundRoute;
