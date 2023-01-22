import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useCats } from '../../hooks/useCats';
import { Image } from '../Image/Image';
import { Spinner } from '../Spinner/Spinner';
import './ImagesGrid.css';

export const ImagesGrid: React.FC = () => {
    const [inputValue, setInputValue] = useState<string>('12');
    const [validationError, setValidationError] = useState<string>('');
    const [clicksLimit, setClicksLimit] = useState<number>(5);

    const {getCats, clickCounter, resetCounter, handleImageClick, catsImages, isFetching} = useCats();

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    }

    const handleEnabledClicksChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setClicksLimit(Number(event.target.value));
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setValidationError('');
        const numValue = Number(inputValue);
        if (numValue < 12) {
            setValidationError('Value must be greater than or equal to 12.');
        } else if (numValue > 60) {
            setValidationError('Value must be lower than or equal to 60.');
        } else {
            getCats(numValue);
            resetCounter();
        }
    }

    useEffect(() => {
        getCats();
    }, [getCats])
    
    return (
        <div className={'container'}>
            <div className={'form'}>
                <span>Images to display (12-60):</span>
                <form onSubmit={handleSubmit}>
                    <input 
                        onChange={handleInputChange}
                        value={inputValue}
                    />
                    <button type={'submit'} disabled={isFetching}>
                        Submit
                    </button>
                </form>
            </div>
            {validationError && (
                <span className={'error'}>{validationError}</span>
            )}
            <div className={'enabledClicks'}>
                Enabled single image changes:
                <select onChange={handleEnabledClicksChange} defaultValue={5}>
                    {Array.from(Array(11).keys()).map(value => (
                        <option key={value} value={value}>
                            {value}
                        </option>
                    ))}
                </select>
            </div>
            {isFetching ? <Spinner /> : (
                <div className={'cats'}>
                    {catsImages?.map(cat => (
                        <Image 
                            key={cat.id} 
                            cat={cat} 
                            onImageClick={handleImageClick}
                            clicksLimit={clicksLimit} 
                        />
                    ))}
                </div>
            )}
            <div className={'counter'}>
                Images changed {clickCounter} times.
                <button onClick={resetCounter}>reset</button>
            </div>
        </div>
    )
}