import { asyncHandler } from "../../utils/asyncHandler.util";
import { ApiResponse } from "../../utils/apiResponse.util.js";
import { logger } from "../../utils/logger.util.js";
import Question from "./Question.model.js";

const addQuestion = asyncHandler(async (req, res) => {
  logger.info("Add question endpoint hit");
  const { title, body = "", tags = [] } = req.body;
  const newQuestion = await Question.create({
    title,
    body,
    tags,
    author: req.user._id,
  });

  res.status(200).json(new ApiResponse(200, {}, "Question added successfully!"))
});

const getAllQuestions = asyncHandler(async (req, res) => {
  logger.info("Get all questions endpoint hit");
});

const getQuestion = asyncHandler(async (req, res) => {
  logger.info("Get question endpoint hit");
});

const getUserQuestions = asyncHandler(async (req, res) => {
  logger.info("Get user questions endpoint hit");
});

const deleteQuestion = asyncHandler(async (req, res) => {
  logger.info("Delete question endpoint hit");
});

export {
  addQuestion,
  getAllQuestions,
  getQuestion,
  deleteQuestion,
  getUserQuestions,
};
