import * as apiClient from "../apiClient";
import { useQuery } from 'react-query';
import { useState } from 'react';
import { HotelType } from '../types/HotelType';
import SearchResultCard from '../components/SearchResultCard';
import Pagination from '../components/Pagination';
import StarRatingFilter from '../components/StarRatingFilter';
import HotelTypesFilter from '../components/HotelTypesFilter';
import FacilitiesFilter from '../components/FacilitiesFilter';
import PriceFilter from '../components/PriceFilter';
import { useSearchContext } from "../hooks/useSearchContext";

const Search = () => {
    const { state: searchValues } = useSearchContext();
    const [page, setPage] = useState<number>(1);
    const [selectedStars, setSelectedStars] = useState<string[]>([]);
    const [hotelTypes, setHotelTypes] = useState<string[]>([]);
    const [facilities, setFacilities] = useState<string[]>([]);
    const [maxHotelPrice, setMaxHotelPrice] = useState<number | undefined>();
    const [sortOption, setSortOption] = useState<string>("");


    const searchParams = {
        destination: searchValues.destination,
        checkIn: searchValues.checkIn.toISOString(),
        checkOut: searchValues.checkOut.toISOString(),
        adultCount: searchValues.adultCount.toString(),
        childCount: searchValues.childCount.toString(),
        page: page.toString(),
        stars: selectedStars,
        types: hotelTypes,
        facilities: facilities,
        maxPrice: maxHotelPrice?.toString(),
        sortOption
    }

    const { data: hotelData } = useQuery(
        ["search-hotels", searchParams],
        () => apiClient.searchHotels(searchParams))


    const handleStarsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const starValue = e.target.value; //number

        setSelectedStars((prevStars) =>
            e.target.checked ?
                [...prevStars, starValue] :
                prevStars.filter(star => star !== starValue)
        )
    }

    const handleHotelTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const hotelType = e.target.value; //number

        setHotelTypes((prevTypes) =>
            e.target.checked ?
                [...prevTypes, hotelType] :
                prevTypes.filter(type => type !== hotelType)
        )
    }

    const handleFacilitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const facility = e.target.value; //number

        setFacilities((prevFacility) =>
            e.target.checked ?
                [...prevFacility, facility] :
                prevFacility.filter(f => f !== facility)
        )
    }

    const handleHotelPriceChange =
        (value?: number) =>
            setMaxHotelPrice(value)



    return (
        <div className='grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5'>
            {/* Filters col */}
            <div className='rounded-lg border border-slate-300 p-5 h-fit sticky top-10'>
                <div className="space-y-5">
                    <h3 className='text-lg font-semibold border-b border-slate-300 pb-5'>
                        Filter By:
                    </h3>
                    {/* Todo filters */}
                    <StarRatingFilter
                        selectedStars={selectedStars}
                        onChange={handleStarsChange} />
                    <HotelTypesFilter
                        selectedHotelTypes={hotelTypes}
                        onChange={handleHotelTypeChange}
                    />
                    <FacilitiesFilter
                        selectedFacilities={facilities}
                        onChange={handleFacilitiesChange}
                    />
                    <PriceFilter selectedPrice={maxHotelPrice} onChange={handleHotelPriceChange} />
                </div>
            </div>

            {/* list of searched hotels */}
            <div className="flex flex-col gap-5">
                <div className='flex justify-between items-center'>
                    <span className='text-xl font-bold'>
                        {hotelData?.pagination.total} Hotels found
                        {searchValues.destination ? ` in ${searchValues.destination}` : ""}
                    </span>

                    {/* sorting options */}
                    <select
                        value={sortOption}
                        onChange={ev => setSortOption(ev.target.value)}
                        className='p-2 border rounded-md'
                    >
                        <option value="">Sort By</option>
                        <option value="starRating">Star Rating</option>
                        <option value="pricePerNightAsc">Price Per Night (Low to High)</option>
                        <option value="pricePerNightDesc">Price Per Night (High to Low)</option>
                    </select>


                </div>

                {hotelData?.data?.map((hotel: HotelType) => (
                    <SearchResultCard key={hotel._id} hotel={hotel} />
                ))}
                <div>
                    <Pagination
                        hotels={hotelData?.data.length}
                        page={hotelData?.pagination.page || 1}
                        pages={hotelData?.pagination.pages || 1}
                        onPageChange={(page) => setPage(page)}
                    />
                </div>
            </div>
        </div>
    )
}

export default Search