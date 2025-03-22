import { Post } from "../types/Post";

export function validatePost(formData: Post) {
  const errors: Partial<Record<keyof Post, string>> = {};

  if (!formData.title?.trim()) {
    errors.title = "Title is required.";
  }
  if (!formData.caption?.trim()) {
    errors.caption = "Caption is required.";
  }
  if (!formData.datetime) {
    errors.datetime = "Date and time are required.";
  } else if (formData.datetime < new Date()) {
    errors.datetime = "Date and time must be in the future.";
  }

  return errors;
}