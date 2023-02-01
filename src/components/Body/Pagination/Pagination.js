import './pagination.css';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import React, { useContext } from 'react'
import CardContext from '../../CardContext'

function Pagination() {
    const { totalPage, handleNextClick, handlePrevClick, currentPage, pageNumbers, handlePageClick, } = useContext(CardContext)
    const addAfterPage = 0
    const addBeforePage = 0
    const beforePage = currentPage === 1 ? addAfterPage + 4 : currentPage === 2 ? addAfterPage + 3 : currentPage === 3 ? addAfterPage + 2 : +2
    const afterPage = currentPage === totalPage ? addBeforePage + 5 : currentPage === totalPage - 1 ? addBeforePage + 4 : currentPage === totalPage - 2 ? addBeforePage + 3 : +3
    const slicedNumbers = pageNumbers.slice(Math.max(0, currentPage - afterPage), Math.min(pageNumbers.length, currentPage + beforePage))
    return (
        <div className='pagination-border'>
            <div className='pagination-border-inside'>

                <button
                    disabled={currentPage === 1}
                    onClick={handlePrevClick}
                    className='page-icons' >
                    <AiFillCaretLeft className='page-icon-left' />
                </button>
                {slicedNumbers
                    .map((page) => (
                        <button
                            key={page}
                            disabled={page === currentPage}
                            className='page-numbers'
                            onClick={() => handlePageClick(page)}
                        > {page} </button>
                    ))}
                <button
                    disabled={currentPage === pageNumbers.length}
                    onClick={handleNextClick}
                    className='page-icons'
                >
                    <AiFillCaretRight className='page-icon-right' />
                </button>
            </div>
        </div>
    )
}

export default Pagination