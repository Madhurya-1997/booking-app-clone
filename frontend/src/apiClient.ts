import axios from "axios"
import { RegisterFormData } from "./types/RegisterFormData"

const API_BASE_URL = "http://localhost:8080/api"

const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    // withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})

export const register = async (req: RegisterFormData) => {
    try {
        const response = await axiosClient.post("/users/register", req);
        await response.data;
    } catch (error: any) {
        throw new Error(error.message)
    }

}