import mongoose, { Schema } from "mongoose";

const questionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      default: "",
    },
    tags: [{ type: String }],
    requiredSkills: [{ type: String }],

    aiTips: {
      type: String,
      default: ""
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isClosed: {
      type: Boolean,
      default: false,
    },

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
      default: 0
    },

    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },

    moderationStatus: {
      type: String,
      enum: ["clean", "flagged", "blocked"],
      default: "flagged",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Question", questionSchema);
