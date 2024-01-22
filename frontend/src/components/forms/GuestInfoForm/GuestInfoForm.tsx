import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../hooks/useAppContext";
import { useSearchContext } from "../../../hooks/useSearchContext";

type GuestInfoFormData = {
    checkIn: Date;
    checkOut: Date;
    adultCount: number;
    childCount: number;
};

type GuestInfoFormProps = {
    pricePerNight: number;
    hotelId: string;
}

const GuestInfoForm = ({
    hotelId,
    pricePerNight
}: GuestInfoFormProps) => {

    const { isLoggedIn } = useAppContext();
    const { state: { checkIn, checkOut, adultCount, childCount }, dispatch } = useSearchContext();
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<GuestInfoFormData>({
        defaultValues: {
            checkIn, checkOut, adultCount, childCount
        }
    });
    const navigate = useNavigate();

    const checkInDate = watch("checkIn");
    const checkOutDate = watch("checkOut");


    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);

    const onSignInClick = (guestData: GuestInfoFormData) => {
        const destination = "";
        dispatch({
            type: "SAVE_SEARCH_VALUES",
            payload: {
                destination,
                checkIn: guestData.checkIn,
                checkOut: guestData.checkOut,
                adultCount: guestData.adultCount,
                childCount: guestData.childCount,
            }
        })

        navigate('/sign-in', {
            state: {
                from: location.pathname
            }
        })
    }

    const onBookNowClick = (guestData: GuestInfoFormData) => {
        const destination = "";
        dispatch({
            type: "SAVE_SEARCH_VALUES",
            payload: {
                destination,
                checkIn: guestData.checkIn,
                checkOut: guestData.checkOut,
                adultCount: guestData.adultCount,
                childCount: guestData.childCount,
            }
        });

        navigate(`/hotel/${hotelId}/booking`);
    }

    return (
        <div className="flex flex-col p-4 bg-blue-200 gap-4">
            <h3 className="text-md font-bold">£{pricePerNight} per night</h3>

            <form onSubmit={
                isLoggedIn ? handleSubmit(onBookNowClick) : handleSubmit(onSignInClick)
            }>
                <div className="grid grid-cols-1 gap-4 items-center">
                    <div>
                        <DatePicker
                            required
                            selected={checkInDate}
                            onChange={(date) => setValue("checkIn", date as Date)}
                            selectsStart
                            startDate={checkInDate}
                            endDate={checkOutDate}
                            minDate={minDate}
                            maxDate={maxDate}
                            placeholderText="Check-in Date"
                            className="min-w-full bg-white p-2 focus:outline-none"
                            wrapperClassName="min-w-full"
                        />
                    </div>
                    <div>
                        <DatePicker
                            required
                            selected={checkOutDate}
                            onChange={(date) => setValue("checkOut", date as Date)}
                            selectsStart
                            startDate={checkInDate}
                            endDate={checkOutDate}
                            minDate={minDate}
                            maxDate={maxDate}
                            placeholderText="Check-in Date"
                            className="min-w-full bg-white p-2 focus:outline-none"
                            wrapperClassName="min-w-full"
                        />
                    </div>
                    <div className="flex bg-white px-2 py-1 gap-2">
                        <label className="items-center flex">
                            Adults:
                            <input
                                className="w-full p-1 focus:outline-none font-bold"
                                type="number"
                                min={1}
                                max={20}
                                {...register("adultCount", {
                                    required: "This field is required",
                                    min: {
                                        value: 1,
                                        message: "There must be at least one adult",
                                    },
                                    valueAsNumber: true,
                                })}
                            />
                        </label>
                        <label className="items-center flex">
                            Children:
                            <input
                                className="w-full p-1 focus:outline-none font-bold"
                                type="number"
                                min={0}
                                max={20}
                                {...register("childCount", {
                                    valueAsNumber: true,
                                })}
                            />
                        </label>
                        {errors.adultCount && (
                            <span className="text-red-500 font-semibold text-sm">
                                {errors.adultCount.message}
                            </span>
                        )}
                    </div>
                    {isLoggedIn ? (
                        <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">
                            Book Now
                        </button>
                    ) : (
                        <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">
                            Sign in to Book
                        </button>
                    )}
                </div>
            </form>
        </div >
    )
}

export default GuestInfoForm