import jwt from "jsonwebtoken"
export const authenticateadmin = async (req, res, next) => {
    try {
        // Ensure cookie-parser is correctly set up
        
        const token = req.cookies?.access_token; // Corrected from req.cookie to req.cookies
        // console.log("Cookies:", token);
        if (!token) {
            return res.status(403).json({ message: "Unauthorized: No token provided" });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decodedToken.role);
        
        
        if (decodedToken.role === "admin") {
            req.user = decodedToken;
            next();
        } else {
            return res.status(403).json({ message: "Forbidden: Only admins are allowed" });
        }
    } catch (error) {
        console.error("JWT Authentication Error:", error.message);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
