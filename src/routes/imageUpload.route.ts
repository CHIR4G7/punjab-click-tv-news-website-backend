import { Router} from "express";
import { imageUploadController } from "../controllers/imageUpload.controller";

const router = Router();

router.get("/", imageUploadController);


export default router;
