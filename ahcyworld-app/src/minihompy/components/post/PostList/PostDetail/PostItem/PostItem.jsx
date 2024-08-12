import React from "react";
import { Link } from "react-router-dom";
import { boardNameCheck } from "../../../utils/postUtils";
import "./PostItem.style.css";

const PostItem = ({ item }) => {
  const hompyId = item.folder.hompy.id;
  const postName = boardNameCheck(item.folder.boardType.name);
  const folderId = item.folder.id;
  const postId = item.id;

  return (
    <>
      <tr>
        <td>{item.id}</td>
        <td>
          <Link
            to={`/hompy/${hompyId}/${postName}/${folderId}/detail/${postId}`}
          >
            {item.subject}
          </Link>
        </td>
        <td>{item.folder.hompy.user.name}</td>
        <td>{item.createAt}</td>
        <td>{item.viewCnt}</td>
      </tr>
    </>
  );
};

export default PostItem;
