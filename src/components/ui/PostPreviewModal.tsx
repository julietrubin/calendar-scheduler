import React from "react";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Post } from "@/types/Post";

interface Props {
  post: Post;
  onEdit: () => void;
  onClose: () => void;
}

const PostPreviewModal: React.FC<Props> = ({ post, onEdit, onClose }) => {
  const renderField = (label: string, value?: string) =>
    value ? (
      <p>
        <strong>{label}:</strong> {value}
      </p>
    ) : null;

  return (
    <Modal onClose={onClose}>
        <h2 className="text-xl font-bold mb-2">{post.title}</h2>
        <div className="space-y-4">
          {renderField("Caption", post.caption)}
          {renderField("Image", post.image)}
          {renderField("Video", post.video)}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="default" onClick={onEdit}>Edit</Button>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
    </Modal>
  );
};

export default PostPreviewModal;