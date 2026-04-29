import Address from "../models/address.model.js";
// add address :/api/address/add
export const addAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const userId = req.user;

    console.log("User ID from token (addAddress):", userId); // Debug log
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - No user ID", success: false });
    }

    const savedAddress = await Address.create({
      ...address,
      userId: userId,
    });
    res
      .status(201)
      .json({ success: true, message: "Address added successfully" });
  } catch (error) {
    console.error("Error in addAddress controller:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
};

//get address:// /api/address/get
export const getAddress = async (req, res) => {
  try {
    const userId = req.user;

    console.log("User ID from token (getAddress):", userId); // Debug log
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - No user ID", success: false });
    }

    const addresses = await Address.find({ userId });
    res.status(200).json({ success: true, addresses });
  } catch (error) {
    console.error("Error in getAddress controller:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
};

// delete address: /api/address/delete/:id
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No user ID", success: false });
    }

    const deletedAddress = await Address.findOneAndDelete({
      _id: id,
      userId: userId,
    });

    if (!deletedAddress) {
      return res
        .status(404)
        .json({ message: "Address not found", success: false });
    }

    res
      .status(200)
      .json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error in deleteAddress controller:", error);
    res
      .status(500)
      .json({
        message: "Internal Server Error",
        error: error.message,
        success: false,
      });
  }
};