import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom"
import * as apiClient from "../apiClient";
import ManageHotelForm from "../components/forms/ManageHotelForm/ManageHotelForm";
import { useAppContext } from "../hooks/useAppContext";

const EditHotel = () => {
    const { hotelId } = useParams();

    const { showToast } = useAppContext();

    const { data: hotel } = useQuery("fetchMyHotelById", () => apiClient.fetchMyHotelById(hotelId || ""), {
        enabled: !!hotelId // !! is to check for a truthy value of hotelId and make sure the api is called only when the hotelId is non empty
    })

    const { mutate, isLoading } = useMutation(apiClient.updateMyHotelById, {
        onSuccess: async () => {
            showToast({ message: "Hotel updated!", type: "SUCCESS" })
        },
        onError: (err: Error) => {
            console.log(err.message);
            showToast({ message: err.message, type: "ERROR" })
        }
    });

    const onSave = (hotelFormData: FormData) => mutate(hotelFormData);

    return <ManageHotelForm hotel={hotel} isLoading={isLoading} onSave={onSave} />
}

export default EditHotel