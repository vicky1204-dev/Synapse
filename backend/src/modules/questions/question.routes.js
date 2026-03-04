import { Router } from "express";
import { verifyJwt } from "../../middlewares/auth.middleware.js";
import {
  addQuestion,
  deleteQuestion,
  getAllQuestions,
  getQuestion,
} from "./question.controller.js";

const router = Router();

router.post("/", verifyJwt, addQuestion);
router.get("/", getAllQuestions);
router.delete("/:id", verifyJwt, deleteQuestion);
router.get("/:id", getQuestion);

export default router;
