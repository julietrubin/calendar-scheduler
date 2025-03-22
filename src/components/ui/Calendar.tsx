// components/ui/Calendar.tsx

import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format } from "date-fns";
import { parse } from "date-fns";
import { startOfWeek } from "date-fns";
import { getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

interface Event {
    title: string;
    datetime: Date | undefined;
    caption?: string;
    image?: string;
    video?: string;
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
        <p>
            <strong>{label}:</strong> {value || "—"}
        </p>
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
    });

    const handleCreatePost = () => {
        setFormData({
            title: "",
            datetime: undefined,
            caption: "",
            image: "",
            video: "",
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

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                    {renderInput("caption", "Caption", formData.caption)}
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

            {selectedEvent && !isEditing &&  (
                <Modal onClose={handleClosePreviewModal}>
                    <h2 className="text-xl font-bold mb-2">{selectedEvent.title}</h2>
                    {renderField("Caption", selectedEvent.caption)}
                    {renderField("Image", selectedEvent.image)}
                    {renderField("Video", selectedEvent.video)}
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
