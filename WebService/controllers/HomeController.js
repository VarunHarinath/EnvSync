import { Result } from "pg";
import { successResponse } from "../model/SuccessResponseModel.js";

const homeController = (req, res, next) => {
  try {
    successResponse(res, Result);
  } catch (e) {
    next(e);
  }
};

export { homeController };
