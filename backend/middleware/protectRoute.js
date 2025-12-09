import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

// ------------------------------------------------------------------
// PROTECT ROUTE MIDDLEWARE
// This middleware checks for a valid JWT in the request cookies.   
// If valid, it attaches the user info to req.user and calls next().
// If invalid or missing, it responds with 401 Unauthorized.
// ------------------------------------------------------------------

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }

        req.user = user; // Attach user info to request object
        
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });    
    }
}