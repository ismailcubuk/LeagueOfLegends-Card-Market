import React, { useEffect, useState } from 'react'

function App() {
  const [champions, setChampions] = useState([])

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = async () => {
    await fetch('http://ddragon.leagueoflegends.com/cdn/13.1.1/data/en_US/champion.json')
      .then(response => response.json())
      .then(json => setChampions(json.data))
  }
  const result = (Object.keys(champions).map((key) => champions[key]));
  console.log(result[0]);


  return (
    <div>
      {
        result.map((hero) => {
          return <div>
            <div>{hero.id}</div>
            <div>{hero.title}</div>
            <img src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${hero.id}_0.jpg`} width="50px" height="100px" alt="asd" />
            <div className='info'>
              <div>Attack = {hero.info.attack}</div>
              <div>Defense = {hero.info.defense}</div>
              <div>Magic = {hero.info.magic}</div>
            </div>
            <div className='tags'>
              <div> {hero.tags} </div>
            </div>
            <br />
            <p> {hero.blurb} </p>

            <hr />
          </div>
        })
      }
    </div>
  )
}

export default App