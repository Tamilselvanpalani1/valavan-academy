import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    testimonials: [
        {
            image: {
                type: String,
            },
            name: {
                type: String,
                required: true,
            },
            domain: {
                type: String,
                required: true, 
            },
            message: {
                type: String,
                required: true,
            },
            ratings: {
                type: Number,
                required: true,
            }
        }
    ]
}, { timestamps: true });

const Testimonials = mongoose.model("Testimonials", testimonialSchema);
export default Testimonials;