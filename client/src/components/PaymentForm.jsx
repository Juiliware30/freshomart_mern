import React, { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";

const PaymentForm = ({ onPaymentSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        console.log("Starting payment confirmation...");

        try {
            const result = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: window.location.origin + "/my-orders",
                },
                redirect: "if_required",
            });

            console.log("Payment confirmation result:", result);

            if (result.error) {
                console.error("Payment confirmation error:", result.error);
                toast.error(result.error.message);
            } else {
                if (result.paymentIntent.status === "succeeded") {
                    console.log("Payment succeeded!");
                    toast.success("Payment Successful!");
                    onPaymentSuccess(result.paymentIntent.id);
                } else {
                    console.log("Payment status:", result.paymentIntent.status);
                    toast.error(`Payment unfinished: ${result.paymentIntent.status}`);
                }
            }
        } catch (error) {
            console.error("Catch error during payment confirmation:", error);
            toast.error("An unexpected error occurred during payment.");
        } finally {
            setIsProcessing(false);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Complete Payment</h2>
            <div className="mb-6">
                <PaymentElement />
            </div>
            <button
                disabled={isProcessing || !stripe || !elements}
                className="w-full bg-emerald-600 text-white py-3 px-4 rounded-md font-medium hover:bg-emerald-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {isProcessing ? "Processing..." : "Pay Now"}
            </button>
        </form>
    );
};

export default PaymentForm;
