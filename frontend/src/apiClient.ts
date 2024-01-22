import { BookingFormData } from "./components/forms/BookingForm/BookingForm";
import { HotelSearchResponse, SearchParams } from "./types/HotelSearchResponse";
import { HotelType } from "./types/HotelType";
import { LoginFormData } from "./types/LoginFormData";
import { PaymentIntentResponse } from "./types/PaymentIntentResponse";
import { RegisterFormData } from "./types/RegisterFormData"
import { UserType } from "./types/UserType";

const API_BASE_URL = "http://localhost:8081/api" || '';

export const fetchCurrentUser = async (): Promise<UserType> => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("Error fetching user");
    }

    return await response.json();
}

export const register = async (req: RegisterFormData) => {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        credentials: "include", //deal with http cookies on sending the request or on getting the response
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(req)
    });

    const data = await response.json();

    if (!response.ok) {
        if (Array.isArray(data.message)) {
            throw new Error(data.message[0].msg)
        } else {
            throw new Error(data.message)
        }
    }

    return data;
}


export const validateToken = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/validate-token`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    })

    if (!response.ok) {
        throw new Error("Invalid Token")
    }

    const data = await response.json();

    return data;
}

export const login = async (req: LoginFormData) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        credentials: "include", //deal with http cookies on sending the request or on getting the response
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(req)
    });

    const data = await response.json();

    if (!response.ok) {
        if (Array.isArray(data.message)) {
            throw new Error(data.message[0].msg)
        } else {
            throw new Error(data.message)
        }
    }

    return data;
}

export const logout = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("Error during sign out!");
    }
}

export const addMyHotel = async (hotelFormData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/my-hotels`, {
        method: "POST",
        credentials: "include",
        body: hotelFormData
    });

    const data = await response.json();

    if (!response.ok) {
        if (Array.isArray(data.message)) {
            throw new Error(data.message[0].msg)
        } else {
            throw new Error(data.message)
        }
    }
    return data;
}

export const fetchMyHotels = async (): Promise<HotelType[]> => {
    const response = await fetch(`${API_BASE_URL}/my-hotels`, {
        method: "GET",
        credentials: "include",
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message)
    }

    return data;
}

export const fetchMyHotelById = async (hotelId: string): Promise<HotelType> => {
    const response = await fetch(`${API_BASE_URL}/my-hotels/${hotelId}`, {
        method: "GET",
        credentials: "include",
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message)
    }

    return data;
}

export const updateMyHotelById = async (hotelFormData: FormData): Promise<HotelType> => {
    const response = await fetch(`${API_BASE_URL}/my-hotels/${hotelFormData.get("hotelId")}`, {
        method: "PUT",
        credentials: "include",
        body: hotelFormData
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message)
    }

    return data;
}

export const searchHotels = async ({
    destination,
    checkIn,
    checkOut,
    adultCount,
    childCount,
    page,
    facilities,
    stars,
    types,
    maxPrice,
    sortOption
}: SearchParams): Promise<HotelSearchResponse> => {

    const queryParams = new URLSearchParams();
    queryParams.append("destination", destination || "");
    queryParams.append("checkIn", checkIn || "");
    queryParams.append("checkOut", checkOut || "");
    queryParams.append("adultCount", adultCount || "");
    queryParams.append("childCount", childCount || "");
    queryParams.append("page", page || "");


    queryParams.append("maxPrice", maxPrice || "");
    queryParams.append("sortOption", sortOption || "");

    facilities?.forEach(f => queryParams.append("facilities", f))
    types?.forEach(t => queryParams.append("types", t))
    stars?.forEach(s => queryParams.append("stars", s))


    const response = await fetch(`${API_BASE_URL}/hotels/search?${queryParams}`);

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message)
    }

    return data;
}

export const fetchHotels = async (): Promise<HotelType[]> => {
    const response = await fetch(`${API_BASE_URL}/hotels`);
    if (!response.ok) {
        throw new Error("Error fetching hotels");
    }
    return response.json();
};

export const fetchHotelById = async (hotelId: string): Promise<HotelType> => {
    const response = await fetch(`${API_BASE_URL}/hotels/${hotelId}`);

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message)
    }

    return data;
}

export const createPaymentIntent = async (hotelId: string, numberOfNights: string): Promise<PaymentIntentResponse> => {
    const response = await fetch(`${API_BASE_URL}/hotels/${hotelId}/bookings/create-payment-intent`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ numberOfNights })
    })

    if (!response.ok) {
        throw new Error("Error creating the payment intent")
    }

    return await response.json();
}

export const createHotelBooking = async (formData: BookingFormData) => {
    const response = await fetch(`${API_BASE_URL}/hotels/${formData.hotelId}/bookings/`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })

    if (!response.ok) {
        throw new Error("Error booking the hotel")
    }
}


export const fetchMyBookings = async (): Promise<HotelType[]> => {
    const response = await fetch(`${API_BASE_URL}/my-bookings`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Unable to fetch bookings");
    }

    return response.json();
};