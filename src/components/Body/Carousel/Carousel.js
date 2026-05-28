import { useContext } from 'react';
import CardContext from '../../component/CardContext';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import './Carousel.css';

function Carousel() {
    const { displayedIChampionsCarousel, carouselPage, dotPagePrevClick, dots, dotPageNextClick, openChampionModal } = useContext(CardContext)

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
    const mappedHeroPics = displayedIChampionsCarousel.map((item) => {
        return (
            <div key={item.id} >
                <div className='hero-pics'>
                    {item.heroPics.map((champion) => (
                        <figure className='carousel-champion-card' key={champion.id}>
                            <button
                                type='button'
                                className='carousel-champion-button'
                                onClick={() => openChampionModal(champion)}
                                aria-label={`Open ${champion.name} details`}
                            >
                                <img
                                    src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion.id}_0.jpg`}
                                    width='150'
                                    height='250'
                                    loading='lazy'
                                    alt={champion.name}
                                />
                                <figcaption>{champion.name}</figcaption>
                            </button>
                        </figure>
                    ))}
                </div>
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
