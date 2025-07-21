import { Schema, model } from "mongoose";

const todoSchema = new Schema(
  {
    task: {
      type: String,
      required: true,
      maxlength: 200,
    },
    done: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Todo = model("Todo", todoSchema);
