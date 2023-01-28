import React from 'react'

function Xa() {
    const futbolcu = [
        { name: "ismail", price: 30 },
        { name: "furkan", price: 20 },
        { name: "murat", price: 10 },
    ]
    const filtered = futbolcu.sort((a, b) => (a.price > b.price) ? 1 : -1)
    console.log(filtered[0].price);
    const dsa = filtered[0].price



    const asd = futbolcu.map((people) => {
        return <div key={people.name}>
            <div> {people.name} </div>
            <div> {people.price} </div>
            <br />
            <br />
        </div>
    })

    return (
        <div>
            <h2>MAPLENENLER</h2>
            <div>
                {asd}
            </div>
            <h2>TEK VERİ</h2>
            {dsa}
        </div>
    )
}

export default Xa