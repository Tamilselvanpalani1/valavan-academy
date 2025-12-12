import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';
import Course from '../models/course.model.js';
import User from '../models/user.model.js';
import cloudinary from 'cloudinary';

export const createCourse = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const { title, thumbnail, category, classesCount, duration, price } = req.body;

        if (!title) {
            return res.status(400).json({ error: "Title is required" });
        }

        let thumbnailUrl = "";
        if (thumbnail) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(thumbnail, {
                    folder: "courses"
                });
                thumbnailUrl = uploadResponse.secure_url;
            } catch (err) {
                console.log("Cloudinary upload error:", err);
                return res.status(400).json({ error: "Invalid thumbnail format" });
            }
        }

        const newCourse = await Course.create({
            user: userId,
            title,
            thumbnail: thumbnailUrl,
            category,
            classesCount,
            duration,
            price,
        });

        res.status(201).json({ message: "Course created successfully", course: newCourse });

    } catch (error) {
        console.log("Error in create course Controller", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.id;

        const course = await Course.findById({ _id: courseId});
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        // if(post.img) {
        //     const imgId = post.img.split('/').pop().split('.')[0];
        //     await cloudinary.uploader.destroy(imgId); // Deleting post image from Cloudinary
        // }

        await Course.findByIdAndDelete({ _id: courseId }); // Delete the post from the database
        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        console.log("Error in delete course Controller", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
