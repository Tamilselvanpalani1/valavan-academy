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
                    id: newUser._id,
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