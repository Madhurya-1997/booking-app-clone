import { hotelFacilities } from '../../../config/hotel-type-options'
import { useFormContext } from 'react-hook-form';
import { HotelFormData } from './ManageHotelForm';

const FacilitiesSection = () => {
    const { register, formState: { errors } } = useFormContext<HotelFormData>();

    return (
        <div>
            <h2 className="text-2xl font-bold mb-3">Facilities</h2>

            <div className="grid grid-cols-3 gap-3">
                {hotelFacilities.map((facility: string) => (
                    <label key={facility} className='text-sm flex gap-1 text-gray-700'>
                        <input type="checkbox" value={facility} {...register("facilities", {
                            validate: (facilities: string[]) => {
                                console.log("This contains the list of all facilities, ", facilities)

                                if (facilities && facilities.length > 0) return true;
                                else return "Atleast one facility is required";
                            },
                        })} />
                        {facility}
                    </label>
                ))}
            </div>
            {errors.facilities && (
                <span className="text-red-500 text-sm font-bold">{errors.facilities.message}</span>
            )}
        </div>
    )
}

export default FacilitiesSection