import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';
import Course from '../models/course.model.js';
import User from '../models/user.model.js';
import cloudinary from 'cloudinary';

export const createCourse = async (req, res) => {
    try {
        const userId = req.user._id.toString(); // Get user ID from req.user set by protectRoute middleware
        const user = await User.findById(userId); // Verify user exists

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

export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1});
        if(courses.length == 0){
            res.status(200).json({ message: "No courses", courses: [] })
        }
        res.status(200).json({ message: "Got all courses", courses: courses })

    } catch (error) {
        console.log("Error in get all posts Controller", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export const updateCourse = async (req, res) => {
    try {
		const userId = req.user._id; // Get the logged-in user's ID from the protectRoute middleware
        let user = await User.findById(userId); // Fetch the user from the database
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }
        const { courseId } = req.params; // Get course ID from request parameters
        let course = await Course.findById({ _id: courseId });
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        let { title, category, classesCount, duration, price, thumbnail } = req.body;
        
        if(thumbnail) {
			if(course.thumbnail) {
				// https://res.cloudinary.com/dyfqon1v6/image/upload/v1712997552/zmxorcxexpdbh8r0bkjb.png
				await cloudinary.uploader.destroy(course.profileImg.split('/').pop().split('.')[0]); // Deleting old profile image from Cloudinary
			}
			const uploadedResponse = await cloudinary.uploader.upload(thumbnail); // Upload profile image to Cloudinary
			thumbnail = uploadedResponse.secure_url; // Get the URL of the uploaded image and assign it back to thumnail(image string)
		}

        course.title = title || course.title;
        course.category = category || course.category;
        course.classesCount = classesCount || course.classesCount;
        course.thumbnail = thumbnail || course.thumbnail;
        course.duration = duration || course.duration;
        course.price = price || course.price;

        course = await course.save(); // Save the updated user to the database
        await res.status(200).json(course); // Respond with the updated course data


    } catch (error) {
        console.log("Error in updateCourse controler", error)
        res.status(500).json({ error: "Internal Server Error" });
    }
}
