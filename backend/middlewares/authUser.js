import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const { token } = req.cookies;
  console.log("Token received:", token); // Debug log
  
  if (!token) {
    console.log("No token provided"); // Debug log
    return res.status(401).json({ message: "Unauthorized - No token", success: false });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Debug log
    req.user = decoded.id;
    next();
  } catch (error) {
    console.error("Error in authUser middleware:", error);
    return res.status(401).json({ message: "Invalid token", success: false });
  }
};

export default authUser;