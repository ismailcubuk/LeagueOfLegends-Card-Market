import { useContext, useState, useEffect } from 'react';
import CardContext from '../../CardContext';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import './Carousel.css';

function Carousel() {
    const { filtered } = useContext(CardContext)
    const [randomFighter, setRandomFighter] = useState()
    const [randomTank, setRandomTank] = useState()
    const [randomMage, setRandomMage] = useState()
    const [randomAssassin, setRandomAssassin] = useState()
    const [randomMarksman, setRandomMarksman] = useState()
    const [randomSupport, setRandomSupport] = useState()


    // FİGHTER PİCS
    const filteredFighter = filtered.filter(item => item.tags.some(tags => tags.includes("Fighter")))
    useEffect(() => {
        let randomFighter = Math.floor(Math.random() * filteredFighter.length)
        setRandomFighter(randomFighter)
    }, [filteredFighter.length])
    const slicePicsFighter = filteredFighter.slice(randomFighter, randomFighter + 3)
    const filteredFighterPics = slicePicsFighter.map((heroPics) => {
        return <img src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${heroPics.id}_0.jpg`} width='150px' height='250px' alt="champions" />
    })

    // TANK PİCS
    const filteredTank = filtered.filter(item => item.tags.some(tags => tags.includes("Tank")))
    useEffect(() => {
        let randomTank = Math.floor(Math.random() * filteredTank.length)
        setRandomTank(randomTank)
    }, [filteredTank.length])
    const slicePicsTank = filteredTank.slice(randomTank, randomTank + 3)
    const filteredTankPics = slicePicsTank.map((heroPics) => {
        return <img src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${heroPics.id}_0.jpg`} width='150px' height='250px' alt="champions" />
    })

    // MAGE PİCS
    const filteredMage = filtered.filter(item => item.tags.some(tags => tags.includes("Mage")))
    useEffect(() => {
        let randomMage = Math.floor(Math.random() * filteredMage.length)
        setRandomMage(randomMage)
    }, [filteredMage.length])
    const slicePicsMage = filteredMage.slice(randomMage, randomMage + 3)
    const filteredMagePics = slicePicsMage.map((heroPics) => {
        return <img src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${heroPics.id}_0.jpg`} width='150px' height='250px' alt="champions" />
    })

    // ASSASSİN PİCS
    const filteredAssassin = filtered.filter(item => item.tags.some(tags => tags.includes("Assassin")))
    useEffect(() => {
        let randomAssassin = Math.floor(Math.random() * filteredAssassin.length)
        setRandomAssassin(randomAssassin)
    }, [filteredAssassin.length])
    const slicePicsAssassin = filteredAssassin.slice(randomAssassin, randomAssassin + 3)
    const filteredAssassinPics = slicePicsAssassin.map((heroPics) => {
        return <img src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${heroPics.id}_0.jpg`} width='150px' height='250px' alt="champions" />
    })

    // MARKSMAN PİCS
    const filteredMarksman = filtered.filter(item => item.tags.some(tags => tags.includes("Marksman")))
    useEffect(() => {
        let randomMarksman = Math.floor(Math.random() * filteredMarksman.length)
        setRandomMarksman(randomMarksman)
    }, [filteredMarksman.length])
    const slicePicsMarksman = filteredMarksman.slice(randomMarksman, randomMarksman + 3)
    const filteredMarksmanPics = slicePicsMarksman.map((heroPics) => {
        return <img src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${heroPics.id}_0.jpg`} width='150px' height='250px' alt="champions" />
    })

    // SUPPORT PİCS
    const filteredSupport = filtered.filter(item => item.tags.some(tags => tags.includes("Support")))
    useEffect(() => {
        let randomSupport = Math.floor(Math.random() * filteredSupport.length)
        setRandomSupport(randomSupport)
    }, [filteredSupport.length])
    const slicePicsSupport = filteredSupport.slice(randomSupport, randomSupport + 3)
    const filteredSupportPics = slicePicsSupport.map((heroPics) => {
        return <img src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${heroPics.id}_0.jpg`} width='150px' height='250px' alt="champions" />
    })

    const heroPicsMap = [
        { id: 1, class: "Fighters", heroPics: filteredFighterPics, img: "https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-fighter.png" },
        { id: 2, class: "Tanks", heroPics: filteredTankPics, img: "https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-tank.png" },
        { id: 3, class: "Mages", heroPics: filteredMagePics, img: "https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-mage.png" },
        { id: 4, class: "Assassins", heroPics: filteredAssassinPics, img: "https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-assassin.png" },
        { id: 5, class: "Marksmans", heroPics: filteredMarksmanPics, img: "https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-marksman.png" },
        { id: 6, class: "Supports", heroPics: filteredSupportPics, img: "https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-support.png" },
    ]


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