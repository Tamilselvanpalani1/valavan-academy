import User from "../models/user.model.js";
import StudentWorks from "../models/studentWorks.model.js";
import cloudinary from 'cloudinary';
export const createStudentWorks = async (req, res) => {
    try {
        const userId = req.user._id.toString();

        const user = await User.findById(userId);
        if (!user) {
            return res.status(403).json({ error: "Unauthorized user" });
        }

        const { tabs } = req.body;

        if (!Array.isArray(tabs) || tabs.length === 0) {
            return res.status(400).json({
                error: "Tabs must be a non-empty array"
            });
        }

        // 🔹 Upload images inside tabs
        for (const tab of tabs) {
            for (const work of tab.studentWorksDetails) {
                if (work.image) {
                    const uploadResponse = await cloudinary.uploader.upload(
                        work.image,
                        { folder: "student-works" }
                    );
                    work.image = uploadResponse.secure_url;
                }
            }
        }

        const studentWorks = await StudentWorks.create({
            user: userId,
            tabs
        });

        return res.status(201).json({
            message: "Student works created successfully",
            data: studentWorks
        });

    } catch (error) {
        console.error("Error in createStudentWorks:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAllStudentWorks = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        const user = await User.findById(userId);
        if (!user) {
            return res.status(403).json({ error: "Unauthorized user" });
        }

        const studentWorks = await StudentWorks.find();
        return res.status(200).json({ data: studentWorks });
    } catch (error) {
        console.error("Error in getAllStudentWorks:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteStudentWorks = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        const user = await User.findById(userId);
        if (!user) {
            return res.status(403).json({ error: "Unauthorized user" });
        }

        const studentWorksDetailsId = req.params.id;
        if (!studentWorksDetailsId) {
            return res.status(400).json({ error: "studentWorksDetailsId is not found" });
        }

        const studentWorksDetails = await StudentWorks.find();
        if (!studentWorksDetails) {
            return res.status(404).json({ error: "Student works not found" });
        }

        const idToDelete = studentWorksDetails.tabs.find(sw => sw._id.toString() === studentWorksDetailsId);
        if (!idToDelete) {
            return res.status(404).json({ error: "Student works ID not found" });
        }

        await StudentWorks.findByIdAndDelete(idToDelete);

        return res.status(200).json({ message: "Student works deleted successfully", data: idToDelete }); 
    } catch (error) {
        console.error("Error in deleteStudentWorks:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

