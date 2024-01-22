import { useContext } from "react";
import { SearchContext } from "../contexts/SearchContext";

export const useSearchContext = () => {
    const context = useContext(SearchContext);
    return context;
}