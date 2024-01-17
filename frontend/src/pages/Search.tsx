import { useSearchContext } from '../contexts/SearchContext'
import * as apiClient from "../apiClient";
import { useQuery } from 'react-query';
import { useState } from 'react';
import { HotelSearchResponse } from '../types/HotelSearchResponse';
import { HotelType } from '../types/HotelType';
import SearchResultCard from '../components/SearchResultCard';
import Pagination from '../components/Pagination';

const Search = () => {
    const { state: searchValues } = useSearchContext();
    const [page, setPage] = useState<number>(1);

    const searchParams = {
        destination: searchValues.destination,
        checkIn: searchValues.checkIn.toISOString(),
        checkOut: searchValues.checkOut.toISOString(),
        adultCount: searchValues.adultCount.toString(),
        childCount: searchValues.childCount.toString(),
        page: page.toString()
    }

    const { data: hotelData } = useQuery(
        ["search-hotels", searchParams],
        () => apiClient.searchHotels(searchParams))

    console.log(searchValues)

    return (
        <div className='grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5'>
            {/* Filters col */}
            <div className='rounded-lg border border-slate-300 p-5 h-fit sticky top-10'>
                <div className="space-y-5">
                    <h3 className='text-lg font-semibold border-b border-slate-300 pb-5'>
                        Filter By:
                    </h3>
                    {/* Todo filters */}
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

                </div>

                {hotelData?.data?.map((hotel: HotelType) => (
                    <SearchResultCard key={hotel._id} hotel={hotel} />
                ))}
                <div>
                    <Pagination
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