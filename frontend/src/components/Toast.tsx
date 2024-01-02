import { useEffect } from "react";

type ToastProps = {
    message: string;
    type: "SUCCESS" | "ERROR";
    onClose: () => void;
}

const Toast = ({ message, type, onClose }: ToastProps) => {

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => clearTimeout(timer);

    }, [onClose])

    const handleClose = () => onClose()

    const styles = type === 'SUCCESS' ?
        "fixed top-4 right-4 z-50 p-4 rounded-md bg-green-600 text-white max-w-md hover:cursor-pointer" :
        "fixed top-4 right-4 z-50 p-4 rounded-md bg-red-600 text-white max-w-md hover:cursor-pointer"

    return (
        <div className={styles} onClick={handleClose}>
            <div className="flex justify-center items-center gap-3">
                <span className="text-lg font-semibold">{message}</span>
            </div>
        </div>

    )
}

export default Toast;