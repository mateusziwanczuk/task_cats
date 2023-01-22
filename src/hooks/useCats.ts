import { useCallback, useState } from "react";
import { apiKey } from "../api/keys";
import { CatDTO } from "../api/types";

export interface Cat extends Pick<CatDTO, 'id' | 'url'> {
    clicks: number;
}

export const useCats = () => {
    const [catsImages, setCatsImages] = useState<Cat[]>();
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [clickCounter, setClickCounter] = useState<number>(0);

    const getCats = useCallback(async (limit: number = 12) => {
        setIsFetching(true);
        try {
            const response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=${limit}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                }
            });
            const data: CatDTO[] = await response.json();
            setCatsImages(data.map(el => ({...el, clicks: 0})))
        } catch (err) {
            console.error(err);
        } 
        setIsFetching(false);
    }, []);

    const getCat = useCallback(async () => {
        let url = '';
        try {
            const response = await fetch('https://api.thecatapi.com/v1/images/search', {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                }
            });
            const data = await response.json();
            url = data[0].url;
        } catch (err) {
            console.error(err);
        }
        return url;
    }, [])

    const handleImageClick = useCallback(async (id: string) => {
        const newImageUrl = await getCat();
        setClickCounter((state) => state + 1);
        setCatsImages((state) => state?.map(catImage => {
            if (catImage.id === id) {
                return {...catImage, url: newImageUrl, clicks: catImage.clicks + 1}
            }
            return catImage;
        }))
    }, [getCat])

    const resetCounter = () => {
        setClickCounter(0);
        setCatsImages((state) => state?.map(catImage => ({...catImage, clicks: 0})))
    };

    return {
        catsImages,
        getCats,
        handleImageClick,
        isFetching,
        clickCounter,
        resetCounter,
    }
};