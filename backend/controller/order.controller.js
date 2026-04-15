import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

// Place order COD: /api/order/place
export const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.user;
    console.log("User ID from token (placeOrderCOD):", userId); // Debug log

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - No user ID", success: false });
    }

    const { items, address } = req.body;
    if (!address || !items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid order details", success: false });
    }

    // calculate amount using single bulk query
    const productIds = items.map(item => item.product);
    const products = await Product.find({ _id: { $in: productIds } });

    let baseAmount = 0;
    let gstAmount = 0;
    for (const item of items) {
      const product = products.find(p => p._id.toString() === item.product.toString());
      if (product) {
        const itemTotal = product.offerPrice * item.quantity;
        baseAmount += itemTotal;
        if (product.gstEnabled) {
          if (product.gstType === "fixed") {
            gstAmount += product.gstPercentage * item.quantity;
          } else {
            gstAmount += (itemTotal * product.gstPercentage) / 100;
          }
        }
      }
    }


    // Add GST
    let amount = baseAmount + Math.floor(gstAmount);
    await Order.create({
      userId,
      items,
      address,
      amount,
      paymentType: "COD",
      isPaid: false,
    });
    res
      .status(201)
      .json({ message: "Order placed successfully", success: true });
  } catch (error) {
    console.error("Error in placeOrderCOD controller:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
};

// oredr details for individual user :/api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user;
    console.log("User ID from token (getUserOrders):", userId); // Debug log

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - No user ID", success: false });
    }

    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error in getUserOrders controller:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
};

// Place order Online (Stripe): /api/order/stripe
export const placeOrderOnline = async (req, res) => {
  try {
    const userId = req.user;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    const { items, address, paymentIntentId } = req.body;
    if (!address || !items || items.length === 0) {
      return res.status(400).json({ message: "Invalid order details", success: false });
    }

    // calculate amount using single bulk query
    const productIds = items.map(item => item.product);
    const products = await Product.find({ _id: { $in: productIds } });

    let baseAmount = 0;
    let gstAmount = 0;
    for (const item of items) {
      const product = products.find(p => p._id.toString() === item.product.toString());
      if (product) {
        const itemTotal = product.offerPrice * item.quantity;
        baseAmount += itemTotal;
        if (product.gstEnabled) {
          if (product.gstType === "fixed") {
            gstAmount += product.gstPercentage * item.quantity;
          } else {
            gstAmount += (itemTotal * product.gstPercentage) / 100;
          }
        }
      }
    }
    let amount = baseAmount + Math.floor(gstAmount);


    await Order.create({
      userId,
      items,
      address,
      amount,
      paymentType: "Stripe",
      isPaid: true,
      // You could store paymentIntentId here if you add it to the model
    });

    res.status(201).json({ message: "Order placed successfully", success: true });
  } catch (error) {
    console.error("Error in placeOrderOnline controller:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
};

// get all orders for admin :/api/order/all
export const getAllOrders = async (req, res) => {

  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error in getAllOrders controller:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
};