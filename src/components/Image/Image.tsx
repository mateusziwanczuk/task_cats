import { memo, useMemo, useState } from "react";
import { Cat } from "../../hooks/useCats"
import { Spinner } from "../Spinner/Spinner";

const IMG_SIZE = 140;

interface ImageProps {
    cat: Cat;
    onImageClick: (id: string) => void;
    clicksLimit: number;
    initialCounterValue?: number;
}

export const Image: React.FC<ImageProps> = memo(({cat, onImageClick, clicksLimit}) => {
    const [isFetching, setIsFetching] = useState<boolean>(false);

    const handleImageClick = async () => {
        if (cat.clicks < clicksLimit) {
            setIsFetching(true);
            await onImageClick(cat.id)
            setIsFetching(false);
        }
    }

    const borderColor = useMemo(() => `#${Math.floor(Math.random()*16777215).toString(16)}`, []);

    const style = {
        border: `5px solid ${borderColor}`,
        width: IMG_SIZE + 'px',
        height: IMG_SIZE + 'px',
    }

    return (
        <div style={style}>
            {isFetching ? <Spinner /> : (
                <img 
                    alt={'cat'} 
                    src={cat.url} 
                    width={IMG_SIZE}
                    height={IMG_SIZE}
                    onClick={handleImageClick}
                /> 
            )}
        </div>
    )
});