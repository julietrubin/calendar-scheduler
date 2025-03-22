import React, { useState } from "react";
import { Calendar } from "react-big-calendar";
import { Button } from "@/components/ui/Button";
import PostModal from "./PostModal";
import PostPreviewModal from "./PostPreviewModal";
import { Post } from "@/types/Post";
import { localizer } from "@/utils/calendarConfig";

import "react-big-calendar/lib/css/react-big-calendar.css";

const MyCalendar: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const handleCloseCreateOrEditModal = () => {
        setIsCreating(false);
        setIsEditing(false);
        setSelectedPost(null);
    };

    const handleFormSubmit = (formData: Post) => {
        if (isCreating) {
            setPosts((prev) => [...prev, formData]);
        } else if (isEditing) {
            setPosts((prev) =>
                prev.map((post) =>
                    post === selectedPost ? { ...formData } : post
                )
            );
        }
        setIsCreating(false);
        setIsEditing(false);
        setSelectedPost(null);
    };

    return (
        <div className="h-screen p-4">
            <div className="flex justify-end mb-4">
                <Button variant="default" onClick={() => (
                    setIsCreating(true))
                }>
                    + Create Post
                </Button>
            </div>
            <Calendar
                localizer={localizer}
                events={posts}
                startAccessor="datetime"
                endAccessor="datetime"
                style={{ height: "100%" }}
                onSelectEvent={(post: Post) => (
                    setSelectedPost(post)
                )}
            />

            {(isEditing || isCreating) && (
                <PostModal
                    isEditing={isEditing}
                    initialData={selectedPost}
                    onSubmit={handleFormSubmit}
                    onClose={handleCloseCreateOrEditModal}
                />
            )}

            {(selectedPost && !isEditing) && (
                <PostPreviewModal
                    post={selectedPost}
                    onEdit={() => (
                        setIsEditing(true)
                    )}
                    onClose={() => (
                        setSelectedPost(null)
                    )}
                />
            )}
        </div>
    );
};

export default MyCalendar;
