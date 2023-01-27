import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Body/Sidebar/Sidebar';
function App() {
  const [champions, setChampions] = useState([])

  useEffect(() => {
    fetchData();
  })

  const fetchData = async () => {
    await fetch('http://ddragon.leagueoflegends.com/cdn/13.1.1/data/en_US/champion.json')
      .then(response => response.json())
      .then(json => setChampions(json.data))
    console.log(champions);
  }
  const result = (Object.keys(champions).map((key) => champions[key]));
  // PAGİNATİON WİTH SLİCE

  return (
    <div className='page'>
      <Navbar />
      <div className='main'>
        <div className='left-sidebar' >
          <Sidebar />
        </div>
        <div className='right-main'>
          <div className='parent'>
            {
              result.slice(0, 13).map((hero) => {
                return <div className='hero-border'>
                  <div className='hero-id'>{hero.id}</div>
                  <div className='hero-title'>{hero.title}</div>
                  <div className='hero-image'>
                    <img src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${hero.id}_0.jpg`} alt="champions" />

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
                    <div className='hero-money'>${hero.info.difficulty}</div>
                  </div>
                </div>
              })
            }
          </div>
        </div>
      </div>

    </div>

  )
}

export default App