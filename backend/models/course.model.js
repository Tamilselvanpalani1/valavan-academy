import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ["beginner", "intermediate", "advanced"] // or make it free text
    },
    classesCount: {
        type: Number,
        default: 0,
    },
    duration: {
        type: String, // Example: "05:00:00" or "5 hours"
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    thumbnail: {
        type: String, // URL of image
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Course = mongoose.model("Course", courseSchema);
export default Course;
