import { Dispatch, ReactNode, createContext, useReducer } from "react";

type SearchContext = {
    state: Search,
    dispatch: Dispatch<SearchAction>
}

type Search = {
    destination: string;
    checkIn: Date;
    checkOut: Date;
    adultCount: number;
    childCount: number;
    hotelId?: string;
}

type SearchAction = {
    type: "SAVE_SEARCH_VALUES";
    payload: Search;
}

const initialSearchState: Search = {
    destination: sessionStorage.getItem("destination") || "",
    checkIn: new Date(sessionStorage.getItem("checkIn") || new Date()),
    checkOut: new Date(sessionStorage.getItem("checkOut") || new Date()),
    adultCount: parseInt(sessionStorage.getItem("adultCount") || "1"),
    childCount: parseInt(sessionStorage.getItem("childCount") || "1"),
    hotelId: sessionStorage.getItem("hotelId") || ""
}

const searchReducer = (state: Search, action: SearchAction) => {
    switch (action.type) {
        case "SAVE_SEARCH_VALUES":
            sessionStorage.setItem("destination", action.payload.destination);
            sessionStorage.setItem("checkIn", action.payload.checkIn.toISOString());
            sessionStorage.setItem("checkOut", action.payload.checkOut.toISOString());
            sessionStorage.setItem("adultCount", action.payload.adultCount.toString());
            sessionStorage.setItem("childCount", action.payload.childCount.toString());
            sessionStorage.setItem("hotelId", (action.payload?.hotelId || ""));

            return {
                ...state, ...{
                    destination: action.payload.destination,
                    checkIn: action.payload.checkIn,
                    checkOut: action.payload.checkOut,
                    adultCount: action.payload.adultCount,
                    childCount: action.payload.childCount,
                    hotelId: (action.payload?.hotelId || "")
                }
            }
        default:
            return { ...state }
    }
}



export const SearchContext = createContext<SearchContext>({
    state: initialSearchState,
    dispatch: () => { }
});

export const SearchContextProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(searchReducer, initialSearchState)

    return (
        <SearchContext.Provider value={{ state, dispatch }}>{children}
        </SearchContext.Provider>
    )
}
