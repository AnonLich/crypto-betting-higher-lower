import { Link } from 'react-router-dom'

const Navbar = () => {
    return(
        <header>
            <div className="container">
                <Link to ="/">
                    <h1>Crypto Betting</h1>
                    <h3>Higher / Lower</h3>
                </Link>
            </div>
        </header>
    )
}

export default Navbar;