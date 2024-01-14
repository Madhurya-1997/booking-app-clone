import { Dispatch, ReactNode, createContext, useContext, useReducer } from "react";

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
    destination: "",
    checkIn: new Date(),
    checkOut: new Date(),
    adultCount: 1,
    childCount: 1,
    hotelId: ""
}

const searchReducer = (state: Search, action: SearchAction) => {
    switch (action.type) {
        case "SAVE_SEARCH_VALUES":
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

export const useSearchContext = () => {
    const context = useContext(SearchContext);
    return context;
}