import React from "react";
import { Button, Container, PageItem } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import './PageNation.css'

const createPageNumber = (start, end) =>{

  const pages =[];
  for(let i = start; i <= end; i++){
    pages.push(i);
  }

  return pages;

}

const PageNation = ({pageAndPostList, setPage}) => {

  const { hompyId, postName } = useParams();
  console.log('PageNation: ',hompyId)
  console.log('PageNation: ',postName)

  const pagesNumbers = createPageNumber(pageAndPostList.startpage,pageAndPostList.endpage);

  const pageSave = (item) =>{
    setPage(item)
  }

  return (
    <Container>
      {pageAndPostList.url && 
      <ul className="pageNation">
      <PageItem>
        <Link onClick={() => pageSave((pageAndPostList.startpage-1))} to={`/post/${hompyId}/${postName}?page=${(pageAndPostList.startpage-1)}`}>
          <FontAwesomeIcon icon={faAnglesLeft} />
        </Link>
      </PageItem>

      <PageItem>
        <Link onClick={() => pageSave((pageAndPostList.startpage+1))} to={`/post/${hompyId}/${postName}?page=${(pageAndPostList.startpage+1)}`}>
          <FontAwesomeIcon icon={faAngleLeft} />
        </Link>
      </PageItem>

      {
        pagesNumbers.map(item => {
          if(item === parseInt(pageAndPostList.page)){
            return <PageItem className="active"><span>{item}</span></PageItem>
          }else{
            return <PageItem><Link onClick={() => pageSave(item)} to={`/post/${hompyId}/${postName}?page=${item}`}>{item}</Link></PageItem>
          }
        })
      }
      
      <PageItem>
        <Link onClick={() => pageSave((pageAndPostList.endpage+1))} to={`/post/${hompyId}/${postName}?page=${(pageAndPostList.endpage+1)}`}>
          <FontAwesomeIcon icon={faAngleRight} />
        </Link>
      </PageItem>

      <PageItem>
        <Link onClick={() => pageSave(pageAndPostList.totalPage)} to={`/post/${hompyId}/${postName}?page=${pageAndPostList.totalPage}`}>
          <FontAwesomeIcon icon={faAnglesRight} />
        </Link>
      </PageItem>
    </ul>
      }
      
    </Container>
  );
};

export default PageNation;
