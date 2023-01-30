import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import MappedCard from '../../component/MappedCard';
import Pagination from '../Pagination/Pagination';
import Carousel from '../Carousel/Carousel';
function Shop() {


  return (
    <div className='page'>
      <Navbar />
      <div className='main'>
        <div className='left-sidebar' >
          <Sidebar />
        </div>
        <div className='carousel-map'>
          <Carousel />
          <MappedCard />
        </div>
      </div>
      <Pagination />
    </div>

  )
}

export default Shop