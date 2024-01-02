import { RegisterFormData } from "./types/RegisterFormData"

const API_BASE_URL = "http://localhost:8080/api"

export const register = async (req: RegisterFormData) => {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(req)
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message);
}