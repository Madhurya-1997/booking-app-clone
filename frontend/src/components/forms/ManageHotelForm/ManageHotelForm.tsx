import { FormProvider, useForm } from 'react-hook-form';
import DetailsSection from './DetailsSection';
import TypeSection from './TypeSection';
import FacilitiesSection from './FacilitiesSection';
import GuestSection from './GuestSection';
import ImageSection from './ImageSection';
import { HotelType } from '../../../types/HotelType';
import { useEffect } from 'react';

interface Props {
    isLoading: boolean;
    onSave: (hotelFormData: FormData) => void;
    hotel?: HotelType;
}

export type HotelFormData = {
    name: string;
    city: string;
    description: string;
    country: string;
    type: string;
    pricePerNight: number;
    adultCount: number;
    childCount: number;
    facilities: string[];
    starRating: number;
    imageFiles: FileList;
    imageUrls: string[];
}

const ManageHotelForm = ({ onSave, isLoading, hotel }: Props) => {
    const formMethods = useForm<HotelFormData>();
    const { handleSubmit, reset } = formMethods;

    useEffect(() => {
        reset(hotel);
    }, [hotel, reset])

    const createNewHotel = handleSubmit((data: HotelFormData) => {
        const hotelFormData = new FormData();

        // if hotel already exists, i.e., edit hotel form
        if (hotel) {
            hotelFormData.append("hotelId", hotel._id);
        }


        hotelFormData.append("name", data.name);
        hotelFormData.append("city", data.city);
        hotelFormData.append("country", data.country);
        hotelFormData.append("description", data.description);
        hotelFormData.append("type", data.type);
        hotelFormData.append("pricePerNight", data.pricePerNight.toString());
        hotelFormData.append("adultCount", data.adultCount.toString());
        hotelFormData.append("childCount", data.childCount.toString());
        hotelFormData.append("starRating", data.starRating.toString());

        data.facilities.forEach((f: string, _idx) => {
            hotelFormData.append(`facilities[${_idx}]`, f);
        })

        Array.from(data.imageFiles).forEach((imgFile) => {
            hotelFormData.append(`imageFiles`, imgFile);
        });

        // in edit mode
        if (data.imageUrls && data.imageUrls.length > 0) {
            data.imageUrls.forEach((imgUrl, _idx) => {
                hotelFormData.append(`imageUrls[${_idx}]`, imgUrl);
            })
        }


        onSave(hotelFormData);
    });

    return (
        <FormProvider {...formMethods}>
            <form className='flex flex-col gap-10' onSubmit={createNewHotel}>
                <DetailsSection />
                <TypeSection />
                <FacilitiesSection />
                <GuestSection />
                <ImageSection />
                <span className="flex justify-end">
                    <button disabled={isLoading} type="submit" className="bg-blue-600 rounded text-white py-2 font-bold hover:cursor-pointer hover:bg-blue-500 px-5 disabled:bg-gray-500">
                        {isLoading ? "Saving..." : "Save"}
                    </button>
                </span>
            </form>
        </FormProvider>

    )
}

export default ManageHotelForm