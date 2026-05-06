import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = req.headers.token || authHeader?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided, login again!"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.id;

        next();
    } catch (err) {
        console.log("Auth Error:", err.message);

        return res.status(401).json({
            success: false,
            message: "Session expired, please login again"
        });
    }
};

export default authUser;
