import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar/Navbar';
function App() {
  const [champions, setChampions] = useState([])

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = async () => {
    await fetch('http://ddragon.leagueoflegends.com/cdn/13.1.1/data/en_US/champion.json')
      .then(response => response.json())
      .then(json => setChampions(json.data))
    console.log(champions);
  }
  const result = (Object.keys(champions).map((key) => champions[key]));


  return (
    <div className='page'>
      <Navbar />
      <div className='parent'>
        {
          result.map((hero) => {
            return <div className='hero-border'>
              <h2 className='hero-id'>{hero.id}</h2>
              <div className='hero-title'>{hero.title}</div>
              <div className='hero-image'>
                <img src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${hero.id}_0.jpg`} alt="champions" />
                <div className='hero-money'>${hero.info.difficulty}</div>
                <div className='hero-tags'> {hero.tags} </div>
              </div>
              <div className='info'>
                <div>
                  <div>Attack</div>
                  <div className='info-img'>{hero.info.attack}</div>
                </div>
                <div>
                  <div>Defense</div>
                  <div className='info-img'>{hero.info.defense}</div>
                </div>
                <div>
                  <div>Magic</div>
                  <div className='info-img'>{hero.info.magic}</div>
                </div>
              </div>
              <div className='card-trade'>
                <Button className='buy-button' variant="success">BUY</Button>
              </div>
            </div>
          })
        }
      </div>
    </div>

  )
}

export default App