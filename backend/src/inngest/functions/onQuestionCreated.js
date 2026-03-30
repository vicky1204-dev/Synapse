import { inngest } from "../client.js";
import { NonRetriableError } from "inngest";
import Question from "../../modules/questions/Question.model.js";
import { analyzeQuestion } from "../agents/questionAnalyzerAgent.js";
import { getIO } from "../../sockets/socket.instance.js";
import { emitNotification } from "../../sockets/emitters/notification.emitter.js";

export const onQuestionCreated = inngest.createFunction(
  { id: "question.created", retries: 2 },
  { event: "question/created" },
  async ({ event, step }) => {
    try {
      const { questionId, author } = event.data;

      const question = await step.run("fetch-question", async () => {
        const questionObject = await Question.findById(questionId);
        if (!questionObject) throw new NonRetriableError("Ticket not found");
        return questionObject;
      });

      const io = getIO();
     await step.run("emit-start-notification", async()=>{
       emitNotification(io, author, {
        type: "question:ai:started",
        questionId,
        message: "AI has started processing your question",
      });
     })

      const analyzedQuestionValues = await analyzeQuestion(question);
      if (!analyzedQuestionValues)
        throw new NonRetriableError(
          "Something went wrong during AI processing",
        );

      await step.run("update-question", async () => {
        await Question.findByIdAndUpdate(question._id, {
          aiTips: analyzedQuestionValues?.supportNotes,
          requiredSkills: analyzedQuestionValues?.requiredSkills,
          moderationStatus: analyzedQuestionValues?.moderationStatus,
        });
      });

       await step.run("emit-completed-notification", async()=>{
       emitNotification(io, author, {
        type: "question:ai:completed",
        questionId,
        message: "Processing Completed",
      });
     })

      return { success: true };
    } catch (error) {
      console.error("Question AI processing failed", {
        error: error.message,
      });
      return { success: false };
    }
  },
);
