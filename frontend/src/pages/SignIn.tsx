import { useForm } from 'react-hook-form';
import { LoginFormData } from '../types/LoginFormData';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { useMutation, useQueryClient } from 'react-query';
import * as apiClient from "../apiClient";

const SignIn = () => {
  const { register, handleSubmit, formState } = useForm<LoginFormData>();
  const { errors } = formState;
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const mutation = useMutation(apiClient.login, {
    onSuccess: async () => {
      showToast({ message: "Login Successful!", type: "SUCCESS" })
      await queryClient.invalidateQueries("validateToken");
      navigate("/");
    },
    onError: (err: Error) => {
      console.log(err.message);
      showToast({ message: err.message, type: "ERROR" })
    }
  });

  const login = handleSubmit((data) => {
    //this callback is called only when all fields in the form are valid 
    mutation.mutate(data);
  })
  return (
    <form className="flex flex-col gap-5" onSubmit={login}>
      <h2 className="text-3xl font-bold">Login to your Account</h2>

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

      <span className='flex items-center justify-between'>
        <span className='text-sm '>Not registered?
          <Link to={'/register'}><span>{' '}</span><span className='underline'>Create an account here</span></Link>
        </span>
        <button
          type="submit"
          className="bg-blue-600 p-2 text-white font-bold hover:bg-blue-500 text-xl">Login</button>
      </span>
    </form>
  )
}

export default SignIn