import React, { useContext, useEffect, useState } from "react";
import { Button, ButtonGroup, Form, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LoginContext } from "../../../../../webpage/components/login/context/LoginContextProvider";

import { detailListHandleOpen, postDelete } from "../../utils/postUtils";

import Comment from "./PostListDetailItemComment/Comment";
import DetailModal from "./PostListDetailItemModal/DetailModal";
import DetailScrapModal from "./PostListDetailItemModal/DetailScrapModal";
import "./PostListDetailItem.style.css";
import { photoAndVideoCommentListAxios } from "../../utils/commentUtils";
import { SERVER_HOST } from "../../../../../apis/api";

const PostListDetailItem = ({ item }) => {
  const { hompyInfo, userInfo , roles} = useContext(LoginContext);
  const { postName, hompyId, folderId } = useParams();
  const [show, setShow] = useState({
    folderMove: false,
    scrapFolder: false,
  });
  const [commentShow, setCommentShow] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const postId = item?.id;

  useEffect(() => {
    if (postId) {
      photoAndVideoCommentListAxios(dispatch, postId);
    }
  }, [postId]);

  return (
    <div key={item.id} className="postDetailListItem">
      <div className="postDetailListItemHeader1">
        <span>작성번호 : {item.id}</span>
        <span>제목 : {item.subject}</span>
        {!(parseInt(hompyId) === hompyInfo?.id) && (
          <>
            <Button
              name="scrapPost"
              onClick={(e) =>
                detailListHandleOpen(
                  e,
                  setShow,
                  show,
                  dispatch,
                  hompyId,
                  postName
                )
              }
            >
              스크랩
            </Button>
          </>
        )}
        {(parseInt(hompyId) === hompyInfo?.id || roles.isAdmin) && (
          <>
            <Button
              onClick={() =>
                navigate(
                  `/hompy/${hompyId}/${postName}/${folderId}/update/${postId}`
                )
              }
            >
              수정
            </Button>
            <Button
              name="folderMove"
              onClick={(e) =>
                detailListHandleOpen(
                  e,
                  setShow,
                  show,
                  dispatch,
                  hompyId,
                  postName
                )
              }
            >
              이동
            </Button>
            <Button
              onClick={() =>
                postDelete(
                  dispatch,
                  hompyId,
                  postName,
                  folderId,
                  postId,
                  navigate
                )
              }
            >
              삭제
            </Button>
          </>
        )}
      </div>
      <div className="postDetailListItemHeader2">
        <span>작성자 : {item.folder.hompy.user.name}</span>
        <span>스크랩 : {item.scrap}</span>
      </div>

      <div className="postDetailListItemDetail">
        {postName.includes("photo") && item.fileList.length > 0 && (
          <div className="postDetailListItemDetailPhotoList">
            {item.fileList.map((fileItem, index) => {
              return (
                fileItem.image === true && (
                  <img
                    className="postDetailListItemDetailImg"
                    key={`photo-${fileItem.fileName}-${fileItem.id}`}
                    src={`${SERVER_HOST}/post/${fileItem.fileName}`}
                    alt={fileItem.fileName}
                  />
                )
              );
            })}
          </div>
        )}

        {postName.includes("video") && item.fileList.length > 0 && (
          <div className="postDetailListItemDetailVideoList">
            {item.fileList.map((fileItem, index) => {
              return (
                fileItem.video === true && (
                  <video
                    className="postDetailListItemDetailVideo"
                    key={`video-${fileItem.fileName}-${fileItem.id}`}
                    width="300"
                    controls
                    loop
                  >
                    <source
                      src={`${SERVER_HOST}/video/${fileItem.fileName}`}
                    />
                  </video>
                )
              );
            })}
          </div>
        )}
        <span>{item.content}</span>
      </div>

      <Comment
        commentShow={commentShow}
        item={item}
        setCommentShow={setCommentShow}
      />

      {(parseInt(hompyId) === hompyInfo?.id || roles.isAdmin) && (
        <DetailModal show={show.folderMove} setShow={setShow} postId={postId} />
      )}

      <DetailScrapModal show={show.scrapFolder} setShow={setShow} item={item} />
    </div>
  );
};

export default PostListDetailItem;
