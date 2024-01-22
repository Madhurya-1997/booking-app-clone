
export const useSessionStorage = (key: string) => {
    const setItem = (value: unknown) => {
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.log(error);
        }
    }
    const getItem = () => {
        try {
            const item = sessionStorage.getItem(key);
            if (!item) {
                return undefined;
            }
            return JSON.parse(item);
        } catch (error) {
            console.log(error);
        }
    }


    return {
        setItem, getItem
    }
}