import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookie } from '../Utils/generateToken.js';


//Signup controller
export const signup = async (req, res) => {
    try{
        const { username, mobileNo, email, password } = req.body;
    } catch (error) {
        console.log("Error in signup controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
    }
}