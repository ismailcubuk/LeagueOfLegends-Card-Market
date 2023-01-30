import React, { useState } from 'react';

function Xa() {
    const data = [
        { id: 1, name: 'John Doe', age: 30 },
        { id: 2, name: 'Jane Doe', age: 25 },
        { id: 3, name: 'Jim Smith', age: 35 }
    ];
    const [index, setIndex] = useState(0);
    const handlePrevClick = () => {
        setIndex(index - 1);
    };
    const handleNextClick = () => {
        setIndex(index + 1);
    };
    return (
        <div>
            <button onClick={handlePrevClick}>Prev</button>
            <div>
                {data.map((item, i) => {
                    return (
                        <div key={item.id} style={{ display: i === index ? 'block' : 'none' }}>
                            <p>Name: {item.name}</p>
                            <p>Age: {item.age}</p>
                        </div>
                    );
                })}
            </div>
            <button onClick={handleNextClick}>Next</button>
        </div>
    )
}

export default Xa