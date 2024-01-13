import { useQuery } from "react-query";
import { useParams } from "react-router-dom"
import * as apiClient from "../apiClient";
import ManageHotelForm from "../components/forms/ManageHotelForm";

const EditHotel = () => {
    const { hotelId } = useParams();

    const { data: hotel } = useQuery("fetchMyHotelById", () => apiClient.fetchMyHotelById(hotelId || ""), {
        enabled: !!hotelId // !! is to check for a truthy value of hotelId and make sure the api is called only when the hotelId is non empty
    })

    const onSave = () => { }

    return <ManageHotelForm hotel={hotel} isLoading={false} onSave={onSave} />
}

export default EditHotel