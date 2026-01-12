import Testimonials from "../models/testimonials.model.js";
import User from "../models/user.model.js";
import cloudinary from 'cloudinary';

export const createTestimonial = async (req, res) => {
    try {
        const userId = req.user._id.toString();

        const user = await User.findById(userId);
        if (!user) {
            return res.status(403).json({ error: "Unauthorized user" });
        }
        const { image } = req.body.testimonials[0];
        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image, {
                folder: "testimonials"
            });
            req.body.testimonials[0].image = uploadResponse.secure_url;
        }
        const { testimonials } = req.body;
        if(!Array.isArray(testimonials) || testimonials.length === 0) {
            return res.status(400).json({ error: "Testimonials must be a non-empty array" });
        }
        let testimonialDoc = await Testimonials.findOne({ user: userId });
        // If no data exists, create a new one 
        if (!testimonialDoc) {
            testimonialDoc = new Testimonials({ user: userId, testimonials: [] });
        }
        // Append new testimonials to existing ones
        let existingTestimonials = testimonialDoc.testimonials;
        if(existingTestimonials.length > 0) {
            existingTestimonials.push(...testimonials);
            testimonialDoc.testimonials = existingTestimonials;
        }
        else{
            testimonialDoc.testimonials = testimonials;
        }
        await testimonialDoc.save();
        return res.status(201).json({
            message: "Testimonials added/updated successfully",
            data: testimonialDoc
        });
    } catch (error) {
        console.log("Error in createOrUpdateTestimonial", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAllTestimonials = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        const user = await User.findById(userId);
        if (!user) {
            return res.status(403).json({ error: "Unauthorized user" });
        }

        const testimonials = await Testimonials.find();
        return res.status(200).json({
            message: "All testimonials retrieved successfully",
            data: testimonials
        });
    } catch (error) {
        console.log("Error in getAllTestimonials", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteTestimonial = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        const user = await User.findById(userId);
        if (!user) {
            return res.status(403).json({ error: "Unauthorized user" });
        }
        const testimonialId = req.params.id;
        const testimonial = await Testimonials.findOne({ "testimonials._id": testimonialId });
        if (!testimonial) {
            return res.status(404).json({ error: "Testimonial not found" });
        }
        let deleteTestimonial = testimonial.testimonials.id(testimonialId);
        testimonial.testimonials.pull(deleteTestimonial); // Remove the testimonial from the array
        await testimonial.save();
        return res.status(200).json({ message: "Testimonial deleted successfully" });
    } catch (error) {
        console.log("Error in deleteTestimonial", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateTestimonial = async (req, res) => {
    try {
        const testimonialId = req.params.id; // _id of the testimonial inside the array
        let { name, domain, message, ratings, image } = req.body;

        // Find the document containing this testimonial inside the array
        const testimonialDoc = await Testimonials.findOne({ "testimonials._id": testimonialId });
        if (!testimonialDoc) {
            return res.status(404).json({ error: "Testimonial not found" });
        }

        // Get the specific testimonial
        const testimonial = testimonialDoc.testimonials.id(testimonialId);
        if (!testimonial) {
            return res.status(404).json({ error: "Testimonial not found" });
        }

        // If image is provided, upload to Cloudinary
        if (image) {
            if (testimonial.image) {
                // Delete old image from Cloudinary (optional)
                const publicId = testimonial.image.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            }
            const uploadResponse = await cloudinary.uploader.upload(image, { folder: "testimonials" });
            image = uploadResponse.secure_url;
            testimonial.image = image;
        }

        // Update the other fields
        testimonial.name = name ?? testimonial.name;
        testimonial.domain = domain ?? testimonial.domain;
        testimonial.message = message ?? testimonial.message;
        testimonial.ratings = ratings ?? testimonial.ratings;

        // Save the parent document
        await testimonialDoc.save();

        return res.status(200).json({
            message: "Testimonial updated successfully",
            data: testimonialDoc
        });

    } catch (error) {
        console.log("Error in updateTestimonial", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

