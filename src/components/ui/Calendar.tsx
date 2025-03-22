import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { generateCaption } from "@/utils/generateCaption";

interface Event {
    title: string;
    datetime: Date | undefined;
    caption?: string;
    image?: string;
    video?: string;
    description?: string;
}

const locales = {
    "en-US": enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const MyCalendar: React.FC = () => {
    const renderField = (label: string, value?: string) => (
        value ? <p>
            <strong>{label}:</strong> {value}
        </p> : <></>
    );

    const renderInput = (name: keyof Event, placeholder: string, value: string | undefined) => (
        <input
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={handleFormChange}
            className="border p-2 mb-2 w-full"
        />
    );

    const renderDateInput = (name: keyof Event, value: Date | undefined) => (
        <input
            type="datetime-local"
            name={name}
            value={value instanceof Date && !isNaN(value.getTime()) ? value.toISOString().slice(0, 16) : ""}
            onChange={handleFormChange}
            className="border p-2 mb-2 w-full"
            min={new Date().toISOString().slice(0, 16)}
        />
    );

    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Event>({
        title: "",
        datetime: new Date(),
        caption: "",
        image: "",
        video: "",
        description: "",
    });

    const handleCreatePost = () => {
        setFormData({
            title: "",
            datetime: undefined,
            caption: "",
            image: "",
            video: "",
            description: "",
        });
        setIsCreating(true);
    };

    const handleSelectEvent = (event: Event) => {
        setSelectedEvent(event);
    };

    const handleClosePreviewModal = () => {
        setSelectedEvent(null);
    };

    const handleCloseCreateOrEditModal = () => {
        setIsCreating(false);
        setIsEditing(false);
        setSelectedEvent(null);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    };

    const handleFormSubmit = () => {
        if (!formData.caption) {
            alert("Caption is required.");
            return;  
        }
        
        if (!formData.title) {
            alert("Title is required.");
            return;  
        }

        if (!formData.datetime) {
            alert("Start date is required.");
            return;
        }

        if (formData.datetime < new Date()) {
            alert("Start date and time must be in the future.");
            return;
        }

        if (isCreating) {
            setEvents((prev) => [...prev, formData]);
        } else if (isEditing) {
            setEvents((prev) =>
                prev.map((event) =>
                    event === selectedEvent ? { ...formData } : event
                )
            );
        }
        setIsCreating(false);
        setIsEditing(false);
        setSelectedEvent(null);
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
        } catch (err) {
            setFormData((prev) => ({ ...prev, caption: "Failed to generate caption." }));
        }
    };

    return (
        <div className="h-screen p-4">
            <div className="flex justify-end mb-4">
                <Button variant="default" onClick={handleCreatePost}>
                    + Create Post
                </Button>
            </div>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="datetime"
                endAccessor="datetime"
                style={{ height: "100%" }}
                onSelectEvent={handleSelectEvent}
            />

            {(isEditing || isCreating) && (
                <Modal onClose={handleCloseCreateOrEditModal}>
                    <h2 className="text-xl font-bold mb-2">
                        {isCreating ? "Create New Post" : "Edit Post"}
                    </h2>
                    {renderInput("title", "Title", formData.title)}
                    <div className="mb-2">
                        <textarea
                            name="description"
                            placeholder="Describe what your post is about..."
                            value={formData.description}
                            onChange={handleFormChange}
                            className="border p-2 mb-2 w-full h-24 resize-none"
                        />
                    </div>
                    <div className="mb-2">
                        {renderInput("caption", "Caption", formData.caption)}
                        <Button variant="outline" type="button" onClick={generateAICaption}>
                            Generate Caption with AI
                        </Button>
                    </div>
                    {renderInput("image", "Image URL", formData.image)}
                    {renderInput("video", "Video URL", formData.video)}
                    {renderDateInput("datetime", formData.datetime)}
                    <div className="flex justify-end gap-2 mt-2">
                        <Button variant="default" onClick={handleFormSubmit}>
                            Save
                        </Button>
                        <Button variant="outline" onClick={handleCloseCreateOrEditModal}>
                            Cancel
                        </Button>
                    </div>
                </Modal>
            )}

            {selectedEvent && !isEditing && (
                <Modal onClose={handleClosePreviewModal}>
                    <h2 className="text-xl font-bold mb-2">{selectedEvent.title}</h2>
                    <div className="space-y-4">
                        {renderField("Caption", selectedEvent.caption)}
                        {renderField("Image", selectedEvent.image)}
                        {renderField("Video", selectedEvent.video)}
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                        <Button
                            variant="default"
                            onClick={() => {
                                setFormData(selectedEvent);
                                setIsEditing(true);
                            }}
                        >
                            Edit
                        </Button>
                        <Button variant="outline" onClick={handleClosePreviewModal}>
                            Close
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default MyCalendar;
