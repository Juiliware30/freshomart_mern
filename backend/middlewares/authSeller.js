import jwt from "jsonwebtoken";
export const authSeller = async (req, res, next) => {
  // Check cookie first, then fall back to Authorization header (for cross-origin Vercel deployments)
  const { sellerToken: cookieToken } = req.cookies;
  const authHeader = req.headers["authorization"];
  const headerToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  const sellerToken = cookieToken || headerToken;

  if (!sellerToken) {
    return res.status(401).json({ message: "Unauthorized - No seller token", success: false });
  }
  
  try {
    const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);
    
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