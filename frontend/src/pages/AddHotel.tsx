import ManageHotelForm from '../components/forms/ManageHotelForm'
import { useMutation } from 'react-query';
import * as apiClient from "../apiClient";
import { useAppContext } from '../contexts/AppContext';

const AddHotel = () => {
    const { showToast } = useAppContext();

    const { mutate, isLoading } = useMutation(apiClient.addMyHotel, {
        onSuccess: async () => {
            showToast({ message: "Hotel saved!", type: "SUCCESS" })
        },
        onError: (err: Error) => {
            console.log(err.message);
            showToast({ message: err.message, type: "ERROR" })
        }
    });

    const onSave = (hotelFormData: FormData) => mutate(hotelFormData);


    return (
        <ManageHotelForm
            onSave={onSave}
            isLoading={isLoading} />
    )
}

export default AddHotel