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
import { useSelector } from "react-redux";
import PostReducer from "../../redux/reducers/PostReducer";

const createPageNumber = (start, end) =>{

  const pages =[];
  for(let i = start; i <= end; i++){
    pages.push(i);
  }

  return pages;

}

const PageNation = ({ setPage}) => {

  const { hompyId, postName } = useParams();

  const pageAndPostList = useSelector(state => state.post.pageAndPostList);

  const pagesNumbers = createPageNumber(pageAndPostList.startpage,pageAndPostList.endpage);

  const folderId = pageAndPostList.folder?.id

  const pageSave = (item) =>{
    setPage(item)
  }

  return (
    <Container>
      {pageAndPostList.url && 
      <ul className="pageNation">
      <PageItem>
        <Link onClick={() => pageSave((pageAndPostList.startpage-1))} to={`/post/${hompyId}/${postName}/${folderId}?page=${(pageAndPostList.startpage-1)}`}>
          <FontAwesomeIcon icon={faAnglesLeft} />
        </Link>
      </PageItem>

      <PageItem>
        <Link onClick={() => pageSave((pageAndPostList.startpage+1))} to={`/post/${hompyId}/${postName}/${folderId}?page=${(pageAndPostList.startpage+1)}`}>
          <FontAwesomeIcon icon={faAngleLeft} />
        </Link>
      </PageItem>

      {
        pagesNumbers.map(item => {
          if(item === parseInt(pageAndPostList.page)){
            return <PageItem className="active"><span>{item}</span></PageItem>
          }else{
            return <PageItem><Link onClick={() => pageSave(item)} to={`/post/${hompyId}/${postName}/${folderId}?page=${item}`}>{item}</Link></PageItem>
          }
        })
      }
      
      <PageItem>
        <Link onClick={() => pageSave((pageAndPostList.endpage+1))} to={`/post/${hompyId}/${postName}/${folderId}?page=${(pageAndPostList.endpage+1)}`}>
          <FontAwesomeIcon icon={faAngleRight} />
        </Link>
      </PageItem>

      <PageItem>
        <Link onClick={() => pageSave(pageAndPostList.totalPage)} to={`/post/${hompyId}/${postName}/${folderId}?page=${pageAndPostList.totalPage}`}>
          <FontAwesomeIcon icon={faAnglesRight} />
        </Link>
      </PageItem>
    </ul>
      }
      
    </Container>
  );
};

export default PageNation;
