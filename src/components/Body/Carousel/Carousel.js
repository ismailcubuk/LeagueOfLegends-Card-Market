import { useContext, useState } from 'react';
import CardContext from '../../component/CardContext';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import './Carousel.css';
import { useSearchParams } from 'react-router-dom';

function Carousel() {
    const { displayedIChampionsCarousel, carouselPage, dotPagePrevClick, dots, dotPageNextClick } = useContext(CardContext)

    const mappedHeroIcons = displayedIChampionsCarousel.map((item) => {
        return (
            <div key={item.id} >
                <img src={item.img} alt="hero class icon" className='carousel-class-img' />
            </div>
        )
    })
    const mappedHeroHeaders = displayedIChampionsCarousel.map((item) => {
        return (
            <div key={item.id} >
                <div className='carousel-header'>{item.class} </div>
            </div>
        )
    })
    const [activate, setActivate] = useState(false)
    const handleClick = () => {
        setActivate(!activate)
    }
    const mappedHeroPics = displayedIChampionsCarousel.map((item) => {
        return (
            <div key={item.id} >
                <div className='hero-pics' onClick={handleClick}>{item.heroPics}</div>
            </div>
        )
    })

    return (
        <div className='carousel'>
            <div className='carousel-hero-border'>
                <div className='carousel-hero-border-inside'>
                    <div className='left-side-carousel'>
                        {mappedHeroHeaders}
                        {mappedHeroIcons}
                        <div className='carousel-buttons'>
                            <button
                                onClick={dotPagePrevClick}
                                disabled={carouselPage === 1}>
                                <AiOutlineArrowLeft className='carousel-buttons-left' />
                            </button>
                            <div className='carousel-numbers'>
                                {dots}
                            </div>
                            <button
                                onClick={dotPageNextClick}
                                disabled={carouselPage === 6}>
                                <AiOutlineArrowRight className='carousel-buttons-right' />
                            </button>
                        </div>
                    </div>
                    <div className='hero-pics-border'>
                        {mappedHeroPics}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Carousel