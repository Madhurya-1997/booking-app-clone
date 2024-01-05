import { useMutation, useQueryClient } from "react-query"
import * as apiClient from "../apiClient";
import { useAppContext } from "../contexts/AppContext";

const SignOutButton = () => {
    const queryClient = useQueryClient();
    const { showToast } = useAppContext();

    const mutation = useMutation(apiClient.logout, {
        onSuccess: async () => {
            showToast({ message: "Signed out", type: "SUCCESS" });
            await queryClient.invalidateQueries("validateToken");
        },
        onError: (err: Error) => {
            showToast({ message: err.message, type: "ERROR" });
        }
    });

    const logout = () => mutation.mutate();

    return (
        <button
            onClick={logout}
            className="flex items-center text-blue-600 px-3 rounded-lg font-bold bg-white hover:cursor-pointer">Sign Out</button>
    )
}

export default SignOutButton