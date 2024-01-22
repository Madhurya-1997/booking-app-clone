import { useForm } from "react-hook-form"
import { UserType } from "../../../types/UserType"
import { PaymentIntentResponse } from "../../../types/PaymentIntentResponse";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";
import * as apiClient from "../../../apiClient";
import { useSearchContext } from "../../../hooks/useSearchContext";
import { useParams } from "react-router-dom";
import { useMutation } from "react-query";
import { useAppContext } from "../../../hooks/useAppContext";

type BookingFormProps = {
    currentUser: UserType;
    paymentIntent: PaymentIntentResponse
}

export type BookingFormData = {
    firstName: string;
    lastName: string;
    email: string;
    adultCount: number;
    childCount: number;
    checkIn: string;
    checkOut: string;
    hotelId: string;
    paymentIntentId: string;
    totalCost: number;
}


const BookingForm = ({
    currentUser,
    paymentIntent
}: BookingFormProps) => {

    const stripe = useStripe();
    const elements = useElements();

    const { state: {
        adultCount,
        childCount,
        checkIn,
        checkOut
    } } = useSearchContext();
    const { showToast } = useAppContext();

    const { hotelId } = useParams();

    const { register, handleSubmit } = useForm<BookingFormData>({
        defaultValues: {
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
            adultCount,
            checkIn: checkIn.toISOString(),
            checkOut: checkOut.toISOString(),
            childCount,
            hotelId,
            totalCost: paymentIntent.totalCost,
            paymentIntentId: paymentIntent.paymentIntentId
        }
    });

    const { mutate: bookRoom, isLoading } = useMutation(apiClient.createHotelBooking, {
        onSuccess: () => {
            // toast success message
            showToast({ type: "SUCCESS", message: "Booking Saved" });
        },
        onError: () => {
            // toast error message
            showToast({ type: "ERROR", message: "Error booking hotel" });
        }
    })

    const submitBooking = async (formData: BookingFormData) => {
        const result = await stripe?.confirmCardPayment(
            paymentIntent.clientSecret,
            {
                payment_method: {
                    card: elements?.getElement(CardElement) as StripeCardElement
                }
            }
        )

        if (result?.paymentIntent?.status === 'succeeded') {
            // book the hotel
            bookRoom({ ...formData, paymentIntentId: result?.paymentIntent?.id })
        }
    }

    return (
        <form
            onSubmit={handleSubmit(submitBooking)}
            className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5">
            <span className="text-3xl font-bold">Confirm Your Details</span>

            <div className="grid grid-cols-2 gap-6">
                <label className="text-gray-700 text-sm font-bold flex-1">
                    First Name
                    <input
                        type="text"
                        className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                        readOnly
                        disabled
                        {...register("firstName")} />
                </label>

                <label className="text-gray-700 text-sm font-bold flex-1">
                    Last Name
                    <input
                        type="text"
                        className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                        readOnly
                        disabled
                        {...register("lastName")} />
                </label>

                <label className="text-gray-700 text-sm font-bold flex-1">
                    Email
                    <input
                        type="text"
                        className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                        readOnly
                        disabled
                        {...register("email")} />
                </label>
            </div>

            <div className="space-y-2">
                <h2 className="text-xl font-semibold">Your Price Summary</h2>
                <div className="bg-blue-200 p-4 rounded-md">
                    <div className="font-semibold text-lg">
                        Total Cost: 💷{paymentIntent.totalCost.toFixed(2)}
                    </div>
                    <div className="text-xs">Include taxes and charges</div>
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="text-xl font-semibold">Payment Details</h3>
                <CardElement id="payment-element" className="border rounded-md p-2 text-sm" />
            </div>

            <div className="flex justify-end">
                <button
                    disabled={isLoading}
                    type="submit"
                    className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-md disabled:bg-gray-500">
                    {isLoading ? "Saving..." : "Confirm Booking"}
                </button>
            </div>

        </form>
    )
}

export default BookingForm