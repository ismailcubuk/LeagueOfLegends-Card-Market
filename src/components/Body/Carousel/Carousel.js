import { useContext, useState } from 'react';
import CardContext from '../../CardContext';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import './Carousel.css';

function Carousel() {
    const { filteredChamp } = useContext(CardContext)
    // FİGHTER PİCS
    const filteredFighter = filteredChamp.filter(item => item.tags.some(tags => tags.includes("Fighter")))
    const randomFighter1 = Math.floor(Math.random() * filteredFighter.length)
    const slicePicsFighter1 = filteredFighter.slice(randomFighter1, randomFighter1 + 3)
    const filteredFighterPics1 = slicePicsFighter1.map((heroPics) => {
        return <img src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${heroPics.id}_0.jpg`} width='150px' height='250px' alt="champions" />
    })

    // TANK PİCS
    const filteredTank = filteredChamp.filter(item => item.tags.some(tags => tags.includes("Tank")))
    const randomTank1 = Math.floor(Math.random() * filteredTank.length)
    const slicePicsTank1 = filteredTank.slice(randomTank1, randomTank1 + 3)
    const filteredTankPics1 = slicePicsTank1.map((heroPics) => {
        return <img src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${heroPics.id}_0.jpg`} width='150px' height='250px' alt="champions" />
    })

    // MAGE PİCS
    const filteredMage = filteredChamp.filter(item => item.tags.some(tags => tags.includes("Mage")))
    const randomMage1 = Math.floor(Math.random() * filteredMage.length)
    const slicePicsMage1 = filteredMage.slice(randomMage1, randomMage1 + 3)
    const filteredMagePics1 = slicePicsMage1.map((heroPics) => {
        return <img src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${heroPics.id}_0.jpg`} width='150px' height='250px' alt="champions" />
    })

    // ASSASSİN PİCS
    const filteredAssassin = filteredChamp.filter(item => item.tags.some(tags => tags.includes("Assassin")))
    const randomAssassin1 = Math.floor(Math.random() * filteredAssassin.length)
    const slicePicsAssassin1 = filteredAssassin.slice(randomAssassin1, randomAssassin1 + 3)
    const filteredAssassinPics1 = slicePicsAssassin1.map((heroPics) => {
        return <img src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${heroPics.id}_0.jpg`} width='150px' height='250px' alt="champions" />
    })

    // MARKSMAN PİCS
    const filteredMarksman = filteredChamp.filter(item => item.tags.some(tags => tags.includes("Marksman")))
    const randomMarksman1 = Math.floor(Math.random() * filteredMarksman.length)
    const slicePicsMarksman1 = filteredMarksman.slice(randomMarksman1, randomMarksman1 + 3)
    const filteredMarksmanPics1 = slicePicsMarksman1.map((heroPics) => {
        return <img src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${heroPics.id}_0.jpg`} width='150px' height='250px' alt="champions" />
    })

    // SUPPORT PİCS
    const filteredSupport = filteredChamp.filter(item => item.tags.some(tags => tags.includes("Support")))
    const randomSupport1 = Math.floor(Math.random() * filteredSupport.length)
    const slicePicsSupport1 = filteredSupport.slice(randomSupport1, randomSupport1 + 3)
    const filteredSupportPics1 = slicePicsSupport1.map((heroPics) => {
        return <img src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${heroPics.id}_0.jpg`} width='150px' height='250px' alt="champions" />
    })

    const heroPicsMap = [
        { id: 1, class: "Fighters", heroPics: filteredFighterPics1, img: "https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-fighter.png" },
        { id: 2, class: "Tanks", heroPics: filteredTankPics1, img: "https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-tank.png" },
        { id: 3, class: "Mages", heroPics: filteredMagePics1, img: "https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-mage.png" },
        { id: 4, class: "Assassins", heroPics: filteredAssassinPics1, img: "https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-assassin.png" },
        { id: 5, class: "Marksmans", heroPics: filteredMarksmanPics1, img: "https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-marksman.png" },
        { id: 6, class: "Supports", heroPics: filteredSupportPics1, img: "https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-support.png" },
    ]
    const [index, setIndex] = useState(0);
    const [carouselPage, setCarouselPage] = useState(1);
    const startIndex = (carouselPage - 1) * 1;
    const endIndex = startIndex + 1;
    const displayedIChampions = heroPicsMap.slice(startIndex, endIndex);
    const totalPage = Math.ceil(heroPicsMap.length / 1)
    const pageNumbers = Array.from({ length: totalPage }, (_, index) => index + 1)


    const mappedHeroIcons = displayedIChampions.map((item, i) => {
        return (
            <div key={item.id} className="carousel-left-border" >
                <div className='carousel-header'>{item.class} </div>
                <img src={item.img} alt="hero class icon" className='carousel-class-img' />
            </div>
        )
    })
    const mappedHeroPics = displayedIChampions.map((item, i) => {
        return (
            <div key={item.id} >
                <div className='hero-pics'>{item.heroPics}</div>
            </div>
        )
    })

    // CAROUSEL
    const dotPageClick = (page) => {
        setCarouselPage(page)
    }

    const dotPageNextClick = () => {
        setCarouselPage(carouselPage + 1);
    };
    const dotPagePrevClick = () => {
        setCarouselPage(carouselPage - 1);
    }

    const dots = pageNumbers.map((page) => (
        <button
            key={page}
            disabled={page === carouselPage}
            onClick={() => dotPageClick(page)}
        > {page} </button>
    ))


    return (
        <div className='carousel'>
            <div className='carousel-hero-border'>
                <div className='carousel-hero-border-inside'>
                    <div className='left-side-carousel'>
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