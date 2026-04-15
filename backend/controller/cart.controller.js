import User from "../models/user.model.js";

// update user cartData: /api/cart/update

export const updateCart = async (req, res) => {
  try {
    const userId = req.user;
    console.log("User ID from token:", userId); // Debug log
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - No user ID", success: false });
    }
    
    const { cartItems } = req.body;
    console.log("Cart items to update:", cartItems); // Debug log
    
    const updatedUser = await User.findByIdAndUpdate(userId, { cartItems }, { new: true });
    
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found", success: false });
    }
    
    res.status(200).json({ success: true, message: "Cart updated", cartItems: updatedUser.cartItems });
  } catch (error) {
    console.error("Error in updateCart controller:", error);
    res.status(500).json({ message: "Server error", error: error.message, success: false });
  }
};