import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookie } from '../Utils/generateToken.js';


//Signup controller
export const signup = async (req, res) => {
    try{
        const { username, mobileNo, email, password } = req.body;

        //email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({ error: "Invalid email format" });
        }
        // Check if user already exists
        const existingEmail = await User.findOne({email});
        if(existingEmail){
            return res.status(400).json({ error: "Email already registered" });
        }

        //username
        const existingUsername = await User.findOne({username});
        if(existingUsername){
            return res.status(400).json({ error: "Username already taken" });
        }

        if(password.length < 6){
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            username,
            mobileNo,
            email,
            password: hashedPassword,
        });

        if(newUser){
            //Generate JWT token and set it as an HTTP-only cookie
            generateTokenAndSetCookie(newUser._id, res);

            // save the new user data to the database
            await newUser.save();

            //RRespond with user info (excluding password)
            res.status(201).json({
                user: {
                    _id: newUser._id,
                    username: newUser.username,
                    mobileNo: newUser.mobileNo,
                    email: newUser.email,
                },
            });
        }
        else{
            res.status(400).json({ error: "Invalid user data" });
        }

    } catch (error) {
        console.log("Error in signup controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        console.log("login: ", user);
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }
        // Compare passwords
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({ error: "Invalid password" });
        }
        // Generate JWT token and set it as an HTTP-only cookie
        generateTokenAndSetCookie(user._id, res);

        // Respond with user info (excluding password)
        res.status(200).json({
            user: {
                _id: user._id,
                username: user.username,
                mobileNo: user.mobileNo,
                email: user.email,
            },
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
    }
}

export const logout = async (req, res) => {
    try {
        // Clear the JWT cookie by setting it to an empty value and expiring it immediately
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getMe = async (req, res) => {
    try {
        // Use the user ID from protectRoute middleware (req.user._id)
        const user = await User.findById({ _id: req.user._id }).select("-password");

    	// Respond with user profile
        res.status(200).json({ user });
    } catch (error) {
        console.log("Error in getMe controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}