import { Link } from "react-router-dom"


export function Pagination({ previusPage, nextPage, crearUrlPagina, pages }) {

    return (
    <div className="pagination">
        <Link to={previusPage()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M15 6l-6 6l6 6" />
            </svg>
        </Link>
        {pages.map(e => <Link key={e} to={crearUrlPagina(e)}>{e}</Link>)}
        <Link to={nextPage()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M9 6l6 6l-6 6" />
            </svg>
        </Link>
    </div>
    )
}