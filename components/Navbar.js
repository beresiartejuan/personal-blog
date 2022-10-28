import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faBars } from "@fortawesome/free-solid-svg-icons"
import Link from 'next/link'

export default function Navbar() {

    let status = false;

    const display_menu = () => {
        const navbar = document.getElementById('navbar-default');
        navbar.classList.toggle('hidden');
    };

    return (
        <nav className="bg-slate-900 text-white p-2 block sm:flex flex-row justify-between text-center px-16 absolute top-0 right-0 left-0">
            <div key="ewfdjwue" className="flex justify-between sm:inline-block sm:min-h-full self-center py-4 sm:py-0">
                <Link href="/"><h2 className="inline-block text-lg cursor-pointer"><strong>Beresiarte</strong></h2></Link>
                <button id="navbar-button" onClick={display_menu} className="sm:hidden"><FontAwesomeIcon icon={faBars}></FontAwesomeIcon></button>
            </div>
            <ul key="fiuhofaew" className="hidden sm:inline-block" id="navbar-default">
                <div className="block py-3 sm:py-0 sm:inline-block">
                    <input name="filter" type="text" autoComplete="off" className="bg-slate-800 p-2 rounded-lg mr-4 outline-none" placeholder="Buscar..."></input>
                    <button id="search"><FontAwesomeIcon icon={faMagnifyingGlass} className="sm:mr-8" /></button>
                </div>
                <Link href="/blog"><li key="blog" className="block py-4 sm:py-0 sm:inline-block sm:mr-8 cursor-pointer">Blog</li></Link>
                <Link href="/tutoriales"><li key="cursos" className="block py-4 sm:py-0 sm:inline-block sm:mr-8 cursor-pointer">Tutoriales</li></Link>
            </ul>
        </nav>
    )
}

