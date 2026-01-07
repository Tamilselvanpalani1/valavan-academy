import mongoose from "mongoose";

const studentWorksSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    tabs: [
        {
            tabHeading: {
                type: String,
                required: true,
            },
            studentWorksHeading: {
                type: String,
                required: true,
            },
            studentWorksDetails: [
                {
                    image: {
                        type: String,
                    },
                    title: {
                        type: String,
                        required: true,
                    },
                    description: {
                        type: String,
                        required: true,
                    }
                }
            ]
        }
    ]
}, { timestamps: true });

const StudentWorks = mongoose.model("StudentWorks", studentWorksSchema);
export default StudentWorks;

