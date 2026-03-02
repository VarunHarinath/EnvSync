import { Router } from "express";
import { 
  newApiController, 
  getApiKeysByProjectId, 
  deleteApiKeyById 
} from "../controllers/ApiController.js";

const apiRouter = Router();

apiRouter.post("/newApi", newApiController);
apiRouter.get("/project/:project_id", getApiKeysByProjectId);
apiRouter.delete("/:id", deleteApiKeyById);

export { apiRouter };
