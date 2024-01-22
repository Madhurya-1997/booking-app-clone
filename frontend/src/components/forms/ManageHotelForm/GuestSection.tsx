import { useFormContext } from 'react-hook-form';
import { HotelFormData } from './ManageHotelForm';

const GuestSection = () => {
    const { register, formState: { errors } } = useFormContext<HotelFormData>();

    return (
        <div>
            <h2 className="text-2xl font-bold mb-3">Guests</h2>

            <div className='grid grid-cols-2 p-6 gap-5 bg-gray-300'>
                <div>
                    <label className='text-gray-700 text-sm font-semibold'>
                        Adult Count
                        <input
                            className="border border-blue-300 focus:outline-none rounded w-full py-1 px-2 font-normal"
                            min={1}
                            type="number"
                            {...register("adultCount", {
                                required: "This is required"
                            })} />
                    </label>
                    {errors.adultCount && (
                        <span className="text-red-500 text-sm font-bold">{errors.adultCount.message}</span>
                    )}
                </div>

                <div>
                    <label className='text-gray-700 text-sm font-semibold'>
                        Child Count
                        <input
                            className="border border-blue-300 focus:outline-none rounded w-full py-1 px-2 font-normal"
                            min={1}
                            type="number"
                            {...register("childCount", {
                                required: "This is required"
                            })} />
                    </label>
                    {errors.childCount && (
                        <span className="text-red-500 text-sm font-bold">{errors.childCount.message}</span>
                    )}
                </div>

            </div>

        </div>
    )
}

export default GuestSection