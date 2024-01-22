import { ReactNode, createContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../apiClient";
import { loadStripe, Stripe } from "@stripe/stripe-js";

const STRIPE_PUB_KEY = import.meta.env.VITE_STRIPE_PUB_KEY || "";

type ToastMessage = {
    message: string;
    type: "SUCCESS" | "ERROR"
}

export type AppContext = {
    showToast: (toastMessage: ToastMessage) => void;
    isLoggedIn: boolean;
    stripePromise: Promise<Stripe | null>
}

const stripePromise = loadStripe(STRIPE_PUB_KEY);

export const AppContext = createContext<AppContext | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
    const [toast, setToast] = useState<ToastMessage | undefined>(undefined);

    const { isError } = useQuery("validateToken", apiClient.validateToken, {
        retry: false
    })

    return (
        <AppContext.Provider value={{
            showToast: (toastMessage) => {
                setToast(toastMessage);
            },
            isLoggedIn: !isError,
            stripePromise
        }}>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(undefined)} />
            )}
            {children}
        </AppContext.Provider>
    )
}
