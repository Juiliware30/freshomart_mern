import jwt from "jsonwebtoken";
export const authSeller = async (req, res, next) => {
  const { sellerToken } = req.cookies;
  console.log("Seller token received:", sellerToken); // Debug log
  
  if (!sellerToken) {
    console.log("No seller token provided"); // Debug log
    return res.status(401).json({ message: "Unauthorized - No seller token", success: false });
  }
  
  try {
    const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);
    console.log("Decoded seller token:", decoded); // Debug log
    
    if (decoded.email === process.env.SELLER_EMAIL) {
      return next();
    } else {
      return res.status(403).json({ message: "Forbidden", success: false });
    }
  } catch (error) {
    console.error("Error in authSeller middleware:", error);
    return res.status(401).json({ message: "Invalid seller token", success: false });
  }
};