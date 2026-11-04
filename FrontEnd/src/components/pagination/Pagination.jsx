import { Link } from "react-router-dom"
import './Pagination.css'


export function Pagination({ totalPages, selectedPage }) {


    let pages
    if (selectedPage < 4) {
        pages = Array.from({ length: 5 }, (_, i) => i + 1)

    } else if (selectedPage >= 4 && selectedPage < totalPages - 2){
        pages = Array.from({ length: 5 }, (_, i) => i + (selectedPage - 3) + 1 )
    
    } else {
        pages = Array.from({ length: 5 }, (_, i) => i + (totalPages - 5) + 1 )
    }


    const previusPage = () => {

        const url_end = new URL(window.location)
        if (parseInt(selectedPage) > 1) {
            url_end.searchParams.set('page', parseInt(selectedPage) - 1)
            return `${url_end.toString()}`
        } else {
            return `${url_end.toString()}`
        }
    }

    const nextPage = () => {

        const url_end = new URL(window.location)
        if (parseInt(selectedPage) !== totalPages) {
            url_end.searchParams.set('page', parseInt(selectedPage) + 1)
            return `${url_end.toString()}`
        } else {
            return `${url_end.toString()}`
        }
        
    }

    const crearUrlPagina = (page) => {
       
        const url_end = new URL(window.location)
        url_end.searchParams.set('page', page)
        return `${url_end.toString()}`

    }

    const firstPage = () => {
        const url_end = new URL(window.location)
        url_end.searchParams.set('page', 1)
        return `${url_end.toString()}`
    }

    const lastPage = () => {
        const url_end = new URL(window.location)
        url_end.searchParams.set('page', totalPages)
        return `${url_end.toString()}`
    }

    return (
    <div className="pagination">
        <Link to={firstPage()}>first</Link>
        <Link className="svg" to={previusPage()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M15 7l-6 6l6 6" />
            </svg>
        </Link>
        {pages.map(e => {

            return <Link 
                            key={e} 
                            to={crearUrlPagina(e)}
                            className={Number(selectedPage) === e ? 'active' : ''}
                            >{e}
                        </Link>})}
        <Link to={nextPage()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M9 7l6 6l-6 6" />
            </svg>
        </Link>
        <Link to={lastPage()}>last</Link>
    </div>
    )
}