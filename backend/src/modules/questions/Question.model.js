import mongoose, { Schema } from "mongoose";

const questionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
    },
    tags: [{ type: String }],
    requiredSkills: [{ type: String }],

    aiTips: String,

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isClosed: Boolean,

    closedReason: {
      type: String,
      default: null,
      enum: ["duplicate", "answered"],
    },
    duplicateOf: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      default: null,
    },
    acceptedAnswer: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      default: null,
    },
    answerCount: {
      type: Number,
    },

    upvotes: Number,
    downvotes: Number,

    moderationStatus: {
      type: String,
      enum: ["clean", "flagged", "blocked"],
      default: "flagged",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Question", questionSchema);
