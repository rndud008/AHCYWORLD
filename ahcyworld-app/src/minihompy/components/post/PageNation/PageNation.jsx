import React from "react";
import { Container, PageItem } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import "./PageNation.css";
import { useDispatch, useSelector } from "react-redux";
import { PostAction } from "../../../../redux/actions/PostAction";

const createPageNumber = (start, end) => {
  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
};

const PageNation = () => {
  const { hompyId, postName, folderId } = useParams();

  const pageAndPostList = useSelector((state) => state.post.pageAndPostList);

  const pagesNumbers = createPageNumber(
    pageAndPostList.startpage,
    pageAndPostList.endpage
  );

  // const folderId = pageAndPostList.folder?.id;

  const dispatch = useDispatch();

  const pageSave = (item) => {
    dispatch(PostAction.setPage(item));
  };

  const start = pageAndPostList.startpage;
  const end = pageAndPostList.endpage;
  const total = pageAndPostList.totalPage;
  const page = pageAndPostList.page;

  return (
    <>
      {pageAndPostList.url && folderId && (
        <ul className="pageNation">
          {page > 1 && (
            <Link
              onClick={() => pageSave(1)}
              to={`/hompy/${hompyId}/${postName}/${folderId}?page=${1}`}
            >
              <FontAwesomeIcon icon={faAnglesLeft} />
            </Link>
          )}

          {page > 1 && (
            // <PageItem>
            <Link
              onClick={() => pageSave(start - 1)}
              to={`/hompy/${hompyId}/${postName}/${folderId}?page=${start - 1}`}
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </Link>
          )}

          {pagesNumbers.map((item) => {
            if (item === parseInt(page)) {
              return (
                <Link key={item} className="postPageActive">
                  {item !==0 ? item: '1'}
                </Link>
              );
            } else {
              return (
                <Link
                  onClick={() => pageSave(item)}
                  to={`/hompy/${hompyId}/${postName}/${folderId}?page=${item}`}
                >
                  {item}
                </Link>
              );
            }
          })}
          {total > end && (
            <Link
              onClick={() => pageSave(end + 1)}
              to={`/hompy/${hompyId}/${postName}/${folderId}?page=${end + 1}`}
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </Link>
          )}

          {page < total && (
            <Link
              onClick={() => pageSave(total)}
              to={`/hompy/${hompyId}/${postName}/${folderId}?page=${total}`}
            >
              <FontAwesomeIcon icon={faAnglesRight} />
            </Link>
          )}
        </ul>
      )}
    </>
  );
};

export default PageNation;
