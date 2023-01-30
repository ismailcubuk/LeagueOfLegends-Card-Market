import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import MappedCard from '../../component/MappedCard';
import Pagination from '../Pagination/Pagination';
function Shop() {


  return (
    <div className='page'>
      <Navbar />
      <div className='main'>
        <div className='left-sidebar' >
          <Sidebar />
        </div>
        <MappedCard />
      </div>
      <Pagination />
    </div>

  )
}

export default Shop