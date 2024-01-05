import { LoginFormData } from "./types/LoginFormData";
import { RegisterFormData } from "./types/RegisterFormData"

const API_BASE_URL = "http://localhost:8080/api" || '';

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