import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import PaymentForm from "../components/PaymentForm";
import toast from "react-hot-toast";

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
if (!stripePublishableKey) {
    console.error("VITE_STRIPE_PUBLISHABLE_KEY is missing in your .env file!");
}
const stripePromise = loadStripe(stripePublishableKey);


const Checkout = () => {
    const { axios, setCartItems } = useAppContext();
    const location = useLocation();
    const navigate = useNavigate();
    const [clientSecret, setClientSecret] = React.useState("");
    const fetchRef = React.useRef(false);

    const { items, address } = location.state || {};

    React.useEffect(() => {
        if (!items || !address) {
            toast.error("Invalid checkout session");
            navigate("/cart", { replace: true });
            return;
        }

        // Prevent double fetching in React 18 Strict Mode
        if (fetchRef.current) return;
        fetchRef.current = true;

        const controller = new AbortController();

        const createPaymentIntent = async () => {
            try {
                const { data } = await axios.post("/api/payment/create-intent",
                    { items },
                    { signal: controller.signal }
                );

                if (data.success) {
                    setClientSecret(data.clientSecret);
                } else {
                    toast.error(data.message || "Failed to get payment secret");
                    navigate("/cart", { replace: true });
                }
            } catch (error) {
                if (error.name === 'CanceledError' || error.name === 'AbortError') return;
                console.error("Error in createPaymentIntent:", error);
                const errorMsg = error.response?.data?.message || "Failed to initialize payment gateway";
                toast.error(errorMsg);
                navigate("/cart", { replace: true });
            }
        };

        createPaymentIntent();

        return () => controller.abort();
    }, [items, address, axios, navigate]);

    const handlePaymentSuccess = React.useCallback(async (paymentIntentId) => {
        try {
            const { data } = await axios.post("/api/order/stripe", {
                items,
                address: address._id,
                paymentIntentId
            });

            if (data.success) {
                toast.success("Order placed successfully!");
                setCartItems({});
                navigate("/my-orders", { replace: true });
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to record order after payment. Please contact support.");
            console.error(error);
        }
    }, [items, address, axios, navigate, setCartItems]);

    const options = React.useMemo(() => ({
        clientSecret,
        appearance: { theme: 'stripe' },
    }), [clientSecret]);

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Secure Checkout
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Please enter your payment details below
                    </p>
                </div>
                {clientSecret ? (
                    <Elements options={options} stripe={stripePromise}>
                        <PaymentForm onPaymentSuccess={handlePaymentSuccess} />
                    </Elements>
                ) : (
                    <div className="flex justify-center flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                        <p className="text-gray-500 font-medium text-lg">Initializing payment gateway...</p>
                    </div>
                )}
            </div>
        </div>
    );
};


export default Checkout;
