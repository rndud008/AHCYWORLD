import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

const ItemPagination = ({ pageData, setCurrentPage }) => {

  const { totalPage, page, startpage, endpage } = pageData;

  const pages = Array.from({ length: endpage - startpage + 1 }, (_, i) => startpage + i);

  return (
    <Pagination>
      {page > 1 ? <Pagination.First onClick={() => { setCurrentPage(1); window.scroll(0, 0); }} /> : null}
      {startpage > 1 ? <Pagination.Prev onClick={() => { setCurrentPage(startpage - 1); window.scroll(0, 0); }} /> : null}

      {totalPage > 1 ?
        (pages.map(k => (
          page === k ? <Pagination.Item onClick={() => { setCurrentPage(k); window.scroll(0, 0); }} active key={k}>{k}</Pagination.Item>
            :
            <Pagination.Item onClick={() => { setCurrentPage(k); window.scroll(0, 0); }} key={k}>{k}</Pagination.Item>
        )))
        :
        null
      }
      {totalPage > endpage ? <Pagination.Next onClick={() => { setCurrentPage(endpage + 1); window.scroll(0, 0); }} /> : null}
      {page < totalPage ? <Pagination.Last onClick={() => { setCurrentPage(totalPage); window.scroll(0, 0); }} /> : null}
    </Pagination>
  );
};

export default ItemPagination;