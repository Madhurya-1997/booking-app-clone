import { useForm } from "react-hook-form"
import { RegisterFormData } from "../types/RegisterFormData";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../apiClient";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../hooks/useAppContext";

const Register = () => {
    const { register, watch, handleSubmit, formState } = useForm<RegisterFormData>();
    const { errors } = formState;

    const { showToast } = useAppContext();

    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const mutation = useMutation(apiClient.register, {
        onSuccess: async () => {
            showToast({ message: "Registration Successful!", type: "SUCCESS" })
            await queryClient.invalidateQueries("validateToken");
            navigate("/");
        },
        onError: (err: Error) => {
            console.log(err.message);
            showToast({ message: err.message, type: "ERROR" })
        }
    });

    const registerAccount = handleSubmit((data) => {
        //this callback is called only when all fields in the form are valid 
        mutation.mutate(data);
    })

    return (
        <form className="flex flex-col gap-5" onSubmit={registerAccount}>
            <h2 className="text-3xl font-bold">Create an Account</h2>

            <div className="flex flex-col md:flex-row gap-5">
                <label className="text-gray-700 font-bold text-sm flex-1">
                    First Name
                    <input
                        type="text"
                        className="border border-b-blue-300 border-t-white border-l-white border-r-white focus:outline-none rounded w-full py-1 px-2 font-normal"
                        {...register("firstName",
                            {
                                required: "This field is required",
                                minLength: {
                                    value: 3,
                                    message: "Password must be atleast 3 characters"
                                }
                            }
                        )} />
                    {errors.firstName && (
                        <span className="text-red-500">{errors.firstName.message}</span>
                    )}
                </label>

                <label className="text-gray-700 font-bold text-sm flex-1">
                    Last Name
                    <input
                        type="text"
                        className="border border-b-blue-300 border-t-white border-l-white border-r-white focus:outline-none rounded w-full py-1 px-2 font-normal"
                        {...register("lastName",
                            {
                                required: "This field is required",
                                minLength: {
                                    value: 3,
                                    message: "Password must be atleast 3 characters"
                                }
                            }
                        )} />
                    {errors.lastName && (
                        <span className="text-red-500">{errors.lastName.message}</span>
                    )}
                </label>
            </div>


            <label className="text-gray-700 font-bold text-sm flex-1">
                Email
                <input
                    type="email"
                    className="border border-b-blue-300 border-t-white border-l-white border-r-white focus:outline-none rounded w-full py-1 px-2 font-normal"
                    {...register("email",
                        {
                            required: "This field is required",
                        }
                    )} />
                {errors.email && (
                    <span className="text-red-500">{errors.email.message}</span>
                )}
            </label>



            <label className="text-gray-700 font-bold text-sm flex-1">
                Password
                <input
                    type="password"
                    className="border border-b-blue-300 border-t-white border-l-white border-r-white focus:outline-none rounded w-full py-1 px-2 font-normal"
                    {...register("password",
                        {
                            required: "This field is required",
                            minLength: {
                                value: 6,
                                message: "Password must be atleast 6 characters"
                            }
                        }
                    )} />
                {errors.password && (
                    <span className="text-red-500">{errors.password.message}</span>
                )}
            </label>



            <label className="text-gray-700 font-bold text-sm flex-1">
                Confirm Password
                <input
                    type="password"
                    className="border border-b-blue-300 border-t-white border-l-white border-r-white focus:outline-none rounded w-full py-1 px-2 font-normal"
                    {...register("confirmPassword",
                        {
                            validate: (value: string) => {
                                if (!value) {
                                    return "This field is required";
                                }
                                if (watch("password") !== value) {
                                    return "Your passwords don't match";
                                }
                            }
                        }
                    )} />
                {errors.confirmPassword && (
                    <span className="text-red-500">{errors.confirmPassword.message}</span>
                )}
            </label>

            <span>
                <button
                    type="submit"
                    className="bg-blue-600 p-2 text-white font-bold hover:bg-blue-500 text-xl">Create Account</button>
            </span>
        </form>
    )
}

export default Register