import { useSearchContext } from '../contexts/SearchContext'

const Search = () => {
    const { state: searchValues } = useSearchContext();

    console.log(searchValues)

    return (
        <div>Search</div>
    )
}

export default Search