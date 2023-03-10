import 'bootstrap/dist/css/bootstrap.min.css';
import Carousel from './components/Body/Carousel/Carousel'
import Navbar from './components/Body/Navbar/Navbar'
import Pagination from './components/Body/Pagination/Pagination'
import Sidebar from './components/Body/Sidebar/Sidebar'
import MappedCard from './components/Body/Cards/MappedCard'

function App() {
    return (
        <div className='page'>
            <div className='main'>
                <Navbar />
                <div className='left-sidebar-background'>
                    <div className='left-sidebar' >
                        <Sidebar />
                    </div>
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

export default App