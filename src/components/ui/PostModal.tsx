import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Post } from "@/types/Post";
import { validatePost } from "@/utils/validation";
import { generateCaption } from "@/utils/generatePost";
import { generateImage } from "@/utils/generatePost";

interface Props {
  initialData?: Post | null;
  isEditing: boolean;
  onSubmit: (data: Post) => void;
  onClose: () => void;
}

const PostModal: React.FC<Props> = ({ initialData, isEditing, onSubmit, onClose }) => {
  const [formData, setFormData] = useState<Post>({
    title: "",
    datetime: undefined,
    caption: "",
    image: "",
    video: "",
    description: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Post, string>>>({});
  const [isRenderingImage, setIsRenderingImage] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "datetime") {
        const date = new Date(value);
        if (date >= new Date()) {
          updated.datetime = date;
        }
      }
      return updated;
    });
    setErrors((prev) => ({ ...prev, [name as keyof Post]: undefined }));
  };

  const handleSubmit = () => {
    const validationErrors = validatePost(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    onSubmit(formData);
  };

  const generateAICaption = async () => {
    const prompt = formData.description?.trim();
    if (!prompt) {
      alert("Please enter a short description to generate a caption.");
      return;
    }
    setFormData((prev) => ({ ...prev, caption: "Generating caption..." }));
    try {
      const aiCaption = await generateCaption(prompt);
      setFormData((prev) => ({ ...prev, caption: aiCaption }));
      setErrors((prev) => ({ ...prev, caption: undefined }));
    } catch {
      setFormData((prev) => ({ ...prev, caption: "Failed to generate caption." }));
    }
  };

  const generateAIImage = async () => {
    const prompt = formData.description?.trim();
    if (!prompt) {
      alert("Please enter a short description to generate an image.");
      return;
    }
    setIsRenderingImage(true);
    setFormData((prev) => ({ ...prev, image: "" }));
    try {
      const aiImageUrl = await generateImage(prompt);
      setFormData((prev) => ({ ...prev, image: aiImageUrl }));
      setIsRenderingImage(false);
    } catch {
      alert("Failed to create image.")
      setFormData((prev) => ({ ...prev, image: "" }));
      setIsRenderingImage(false);
    }
  };

  const renderInput = (name: keyof Post, placeholder: string, value: string | undefined) => (
    <div className="mb-2">
      <input
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
    </div>
  );

  const renderDateInput = (name: keyof Post, value: Date | undefined) => (
    <div className="mb-2">
      <input
        type="datetime-local"
        name={name}
        value={value instanceof Date && !isNaN(value.getTime()) ? value.toISOString().slice(0, 16) : ""}
        onChange={handleChange}
        className="border p-2 w-full"
        min={new Date().toISOString().slice(0, 16)}
      />
      {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <Modal onClose={onClose}>
      <div className="bg-white p-6 rounded shadow-md max-w-md w-full">
        <h2 className="text-xl font-bold mb-2">
          {isEditing ? "Edit Post" : "Create New Post"}
        </h2>

        {renderInput("title", "Title", formData.title)}

        <textarea
          name="description"
          placeholder="Describe what your post is about..."
          value={formData.description}
          onChange={handleChange}
          className="border p-2 w-full h-24 resize-none mb-2"
        />

        {renderInput("caption", "Caption", formData.caption)}
        <Button variant="outline" type="button" className="mt-1 mb-4" onClick={generateAICaption}>
          Generate Caption with AI
        </Button>

        {formData.image && !isRenderingImage && (
          <div className="mb-4">
            <img
              src={formData.image}
              alt="Generated"
              className="w-full h-auto object-cover rounded-md"
            />
          </div>
        )}

        {isRenderingImage && (
          <div className="text-left text-gray-500">Generating image...</div>
        )}

        <Button variant="outline" type="button" className="mt-1 mb-4" onClick={generateAIImage}>
          Generate Image with AI
        </Button>

        {renderInput("video", "Video URL", formData.video)}
        {renderDateInput("datetime", formData.datetime)}

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="default" onClick={handleSubmit}>Save</Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </Modal>
  );
};

export default PostModal;
