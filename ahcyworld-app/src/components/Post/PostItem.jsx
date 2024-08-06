import React from "react";
import { Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { boardNameCheck } from "./postUtils";

const PostItem = ({ item}) => {
  const hompyId = item.folder.hompy.id;
  const postName = boardNameCheck(item.folder.boardType.name);
  const folderId = item.folder.id
  const postId = item.id;

  return (
    <>
      <tr>
        <td>{item.id}</td>
        <td>
          <Link to={`/post/${hompyId}/${postName}/${folderId}/detail/${postId}`}>{item.subject}</Link>
        </td>
        <td>{item.folder.hompy.user.name}</td>
        <td>{item.createAt}</td>
        <td>{item.viewCnt}</td>
      </tr>
    </>
  );
};

export default PostItem;
