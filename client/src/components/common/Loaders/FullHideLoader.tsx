import { LoaderCircle } from "lucide-react";
const FullHideLoader = ({
    size = 50,
    colorClass = "text-white",
}: {
    size?: number;
    colorClass?: string;
}) => {
    return (
        <div className="h-screen flex justify-center items-center">
            <LoaderCircle
                className={`${colorClass}  animate-spin`}
                size={size}
                strokeWidth={"1px"}
            />
        </div>
    );
};

export default FullHideLoader;
