import { useQuery } from 'react-query'
import * as apiClient from "../apiClient";
import BookingForm from '../components/forms/BookingForm/BookingForm';
import { useSearchContext } from '../hooks/useSearchContext';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BookingDetailsSummary from '../components/BookingDetailsSummary';

const Booking = () => {
    const { state: searchState } = useSearchContext();
    const { hotelId } = useParams();

    const [numberOfNights, setNumberOfNights] = useState<number>(0);

    useEffect(() => {
        if (searchState.checkIn && searchState.checkOut) {
            const nights = Math.ceil(Math.abs(searchState.checkOut.getTime() - searchState.checkIn.getTime()) / (1000 * 24 * 60 * 60));

            setNumberOfNights(nights);
        }
    }, [searchState.checkIn, searchState.checkOut])

    const { data: hotel } = useQuery("fetchHotelById", () => apiClient.fetchHotelById(hotelId as string), {
        enabled: !!hotelId
    });

    const { data: currentUser } = useQuery("fetchCurrentUser", apiClient.fetchCurrentUser)

    return (
        <div className="grid md:grid-cols-[1fr_2fr]">
            {hotel &&
                <BookingDetailsSummary
                    hotel={hotel}
                    checkIn={searchState.checkIn}
                    checkOut={searchState.checkOut}
                    adultCount={searchState.adultCount}
                    childCount={searchState.childCount}
                    numberOfNights={numberOfNights}
                />}

            {currentUser &&
                <BookingForm currentUser={currentUser} />}


        </div>
    )
}

export default Booking