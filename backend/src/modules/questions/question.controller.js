import { asyncHandler } from "../../utils/asyncHandler.util.js";
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
  const page = parseInt(req.query?.page) || 1
  const limit = parseInt(req.query?.limit) || 10
  const startIndex = (page - 1) * limit

  const questions = await Question.find({}).sort({createdAt: -1}).skip(startIndex).limit(limit)
  const totalQuestions = await Question.countDocuments()

  const result = {
    questions,
    totalPages: totalQuestions/limit,
    currentPageNumber: page
  }

  res.status(200).json(new ApiResponse(200, result, "Questions fetched successfully"))
});

const getQuestion = asyncHandler(async (req, res) => {
  logger.info("Get question endpoint hit");
  const questionId = req.params?.id
  const question = await Question.findById(questionId)
  if(!question){
    logger.warn("Question not found")
    return res.status(404).json(404, {}, "Question not found")
  }
  res.status(200).json(new ApiResponse(200, question, "Question fetched successfully"))
});

const deleteQuestion = asyncHandler(async (req, res) => {
  logger.info("Delete question endpoint hit");
  const questionId = req.params?.id
  const question = await Question.find({_id: questionId, author: req.user._id})
  if(!question) {
    return res.status(404).json(new ApiResponse(404, {}, "Error deleting question"))
  }
  await Question.findByIdAndDelete(question._id)
  res.status(200).json(new ApiResponse(200, question, "Question deleted successfully"))
});

export {
  addQuestion,
  getAllQuestions,
  getQuestion,
  deleteQuestion,
  getUserQuestions,
};
