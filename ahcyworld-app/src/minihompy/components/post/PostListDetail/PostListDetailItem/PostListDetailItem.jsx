import React, { useContext, useEffect, useState } from "react";
import { Button, ButtonGroup, Form, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch  } from "react-redux";
import { LoginContext } from "../../../../../webpage/components/login/context/LoginContextProvider"; 

import {
  detailListHandleOpen,
  photoAndVideoCommentListAxios,
  postDelete,
} from "../../utils/postUtils";

import Comment from "./PostListDetailItemComment/Comment";
import DetailModal from "./PostListDetailItemModal/DetailModal";
import DetailScrapModal from "./PostListDetailItemModal/DetailScrapModal";

const PostListDetailItem = ({ item }) => {
  const { hompyInfo, userInfo } = useContext(LoginContext);
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
    photoAndVideoCommentListAxios(dispatch, postId);
  }, []);

  return (
    <>
      <div>
        <span>작성번호 : {item.id}</span>
        <span>제목 : {item.subject}</span>
      </div>
      <div>
        <span>작성자 : {item.folder.hompy.user.name}</span>
        <span>스크랩 : {item.scrap}</span>
      </div>
      <div>
        {item.fileList.map((fileItem, index) => {
          if (postName.includes("photo") && fileItem.image === true) {
            return (
              <img
                key={`photo-${fileItem.fileName}-${fileItem.id}`}
                src={`http://localhost:8070/post/${fileItem.fileName}`}
                alt={fileItem.fileName}
                style={{ width: "200px", height: "auto", margin: "10px" }}
              />
            );
          } else if (postName.includes("video") && fileItem.video === true) {
            return (
              <video
                key={`video-${fileItem.fileName}-${fileItem.id}`}
                width="300"
                controls
                loop
              >
                <source
                  src={`http://localhost:8070/video/${fileItem.fileName}`}
                />
              </video>
            );
          }
          return null;
        })}
        {item.content}
      </div>

      <div>
        <div>
          <ButtonGroup>
            <Button onClick={() => setCommentShow(!commentShow)}>
              {commentShow === false ? "댓글보기" : "댓글닫기"}
            </Button>

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

            {parseInt(hompyId) === hompyInfo?.id && (
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
          </ButtonGroup>
        </div>
        <Comment commentShow={commentShow} item={item} />
      </div>

      {parseInt(hompyId) === hompyInfo?.id && (
        <DetailModal show={show.folderMove} setShow={setShow} postId={postId} />
      )}

      <DetailScrapModal show={show.scrapFolder} setShow={setShow} item={item} />
    </>
  );
};

export default PostListDetailItem;
