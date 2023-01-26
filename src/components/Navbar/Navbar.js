import './navbar.css';
function TopNavbar() {
    return (
        <nav className='navbar'>
            <a href="#" className='logo'>League of Legends Card Shop</a>
            <input type="checkbox" id='toggler' />
            <label htmlFor="toggler">asd</label>

            <div className="menu">
                <ul className='list'>
                    <li> <a href="Home">Home</a> </li>
                    <li> <a href="Profile">Profile</a> </li>
                    {/* <h2>$100</h2> */}
                </ul>
            </div>
        </nav>
    );
}

export default TopNavbar;