import Stripe from "stripe";
import Product from "../models/product.model.js";
import dotenv from "dotenv";

dotenv.config();

let stripe;

const getStripe = () => {
    if (!stripe) {
        if (!process.env.STRIPE_SECRET_KEY) {
            console.error("STRIPE_SECRET_KEY is missing in .env file");
        }
        stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
    return stripe;
};

export const createPaymentIntent = async (req, res) => {
    console.log("Create Payment Intent request received");
    try {
        const { items } = req.body;
        console.log("Items received:", items);

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "No items in cart", success: false });
        }

        const stripeInstance = getStripe();

        // Optimized: Fetch all products in one query to reduce DB roundtrips
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


        // Stripe minimum amount check (approx ₹50 for INR)
        if (amount < 50) {
            return res.status(400).json({
                message: `Order total must be at least ₹50 for online payment. Your current total is ₹${amount}. Please add more items or choose Cash on Delivery.`,
                success: false
            });
        }


        // Stripe expects amount in cents
        console.log("Creating payment intent for amount (INR):", amount);

        const paymentIntent = await stripeInstance.paymentIntents.create({
            amount: Math.round(amount * 100), // convert to cents and ensure integer
            currency: "inr",
            automatic_payment_methods: {
                enabled: true,
            },
        });

        console.log("Payment intent created successfully:", paymentIntent.id);

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).json({
            message: "Payment initialization failed",
            success: false,
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

