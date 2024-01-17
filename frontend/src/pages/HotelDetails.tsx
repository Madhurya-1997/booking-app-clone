import { useParams } from "react-router-dom";

const HotelDetails = () => {
    const { id } = useParams();

    console.log(id)

    return (
        <div>HotelDetails</div>
    )
}

export default HotelDetails