import React, { useContext, useEffect, useState } from "react";
import { Button, ButtonGroup, Container, Form, Modal } from "react-bootstrap";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import api from "../../../apis/api";
import { useDispatch, useSelector } from "react-redux";
import { PostAction } from "../../../redux/actions/PostAction";
import { FolderAction } from "../../../redux/actions/FolderAction";
import { LoginContext } from "../../../webpage/login/context/LoginContextProvider";
import { CommentAction } from "../../../redux/actions/CommentAction";

const PostListDetailItem = ({ item }) => {
  const { hompyInfo, userInfo } = useContext(LoginContext);
  const { postName, hompyId, folderId } = useParams();
  const [show, setShow] = useState({
    folderMove: false,
    scrapFolder: false,
  });
  const [scrap, setScrap] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const folderList = useSelector((state) => state.folder.folderList);
  const scrapFolderList = useSelector((state) => state.folder.scrapFolderList);
  const [moveFolderId, setMoveFolderId] = useState();

  const postId = item?.id;

  const photoAndVideoCommentList = useSelector(
    (state) => state.comment.photoAndVideoCommentList
  );
  const [content, setContent] = useState();
  const [commentShow, setCommentShow] = useState(false);

  console.log(photoAndVideoCommentList);

  const photoAndVideoCommentListAxios = async () => {
    try {
      await dispatch(CommentAction.photoAndVideoCommentListAxios(postId));
    } catch (e) {
      alert(e);
    }
  };

  const commentWriteAxios = async () => {
    try {
      await dispatch(
        CommentAction.commentWriteAxios(userInfo, item, content, postName)
      );
    } catch (e) {
      alert(e);
    }
  };

  const commentDeleteAxios = async (commentId) => {
    try {
      await dispatch(
        CommentAction.commentDeleteAxios(commentId, item.id, postName)
      );
    } catch (e) {
      alert(e);
    }
  };

  const postDelete = async () => {
    if (!window.confirm("삭제 하시겠습니까?")) return;

    dispatch(
      PostAction.deletePostAxios(hompyId, postName, folderId, postId, navigate)
    );
  };

  const moveFolder = async (e) => {
    e.preventDefault();

    dispatch(
      PostAction.movePostFolderAxios(
        hompyId,
        postName,
        folderId,
        postId,
        postId,
        moveFolderId,
        navigate
      )
    );

    setShow(false);
  };

  const handleOpen = async (e) => {
    const { name } = e.target;
    if (name === "folderMove") {
      setShow({ ...show, folderMove: true });
    }

    if (name === "scrapPost") {
      try {
        await dispatch(FolderAction.getScrapFolderListAxios(hompyId, postName));
      } catch (error) {
        alert(error.response.data);
        return;
      }

      setShow({ ...show, scrapFolder: true });
    }
  };

  const handleClose = (e) => {
    if (e === undefined) {
      setShow({
        folderMove: false,
        scrapFolder: false,
      });
      return;
    }

    if (e.target.name === "folderMove") {
      setShow({ ...show, folderMove: false });
    } else if (e.target.name === "scrapFolder") {
      setShow({ ...show, scrapFolder: false });
    }
  };

  const changeValue = (e) => {
    const { id } = e.target;

    setMoveFolderId(id);
  };

  const postScrap = async (e) => {
    e.preventDefault();

    let post = item;

    const response = await api.post(
      `http://localhost:8070/${hompyId}/${postName}/${folderId}/detail/${scrap}`,
      item
    );

    const { data, status, statusText } = response;
    console.log(data);

    if (status === 200) {
      alert("스크랩 완료");
    } else {
      alert(statusText);
    }
  };
  useEffect(() => {
    photoAndVideoCommentListAxios();
  }, []);

  let result = photoAndVideoCommentList.find((item) => item.postId === postId);

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
                <Button name="scrapPost" onClick={handleOpen}>
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
                <Button name="folderMove" onClick={handleOpen}>
                  이동
                </Button>
                <Button onClick={postDelete}>삭제</Button>
              </>
            )}
          </ButtonGroup>
        </div>

        {commentShow && (
          <div>
            {result?.data?.length === 0 ? (
              <div>작성된 댓글이 없습니다.</div>
            ) : (
              result?.data.map((item) => (
                <div style={{ display: "flex" }}>
                  <p>{item.user.name}</p>
                  <p>{item.createAt}</p>
                  <p>{item.content}</p>
                  <Button onClick={() => commentDeleteAxios(item.id)}>
                    삭제
                  </Button>
                </div>
              ))
            )}
          </div>
        )}

        <div>
          <label>댓글</label>
          <input
            onChange={(e) => setContent(e.target.value)}
            placeholder="댓글입력"
          />
          <Button onClick={commentWriteAxios}>확인</Button>
        </div>
      </div>

      {parseInt(hompyId) === hompyInfo?.id && (
        <>
          <Modal show={show.folderMove} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>폴더 이동</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={moveFolder}>
                <Form.Group>
                  <Form.Label>폴더 리스트 :</Form.Label>
                  <div>
                    {folderList &&
                      folderList.map((folderItem) => {
                        return (
                          <Form.Check
                            key={`move-folder-${folderItem.id}`}
                            type="radio"
                            id={`move-folder-radio-${folderItem.id}`}
                            value={folderItem.name}
                            name="folder"
                            label={folderItem.name}
                            onChange={changeValue}
                            checked={folderItem.id === parseInt(moveFolderId)}
                          />
                        );
                      })}
                  </div>
                </Form.Group>

                <Button variant="primary" type="submit">
                  이동
                </Button>
                <Button
                  name="folderMove"
                  variant="secondary"
                  onClick={handleClose}
                >
                  취소
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </>
      )}

      <Modal show={show.scrapFolder} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>스크랩</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={postScrap}>
            <Form.Group>
              <Form.Label>폴더 리스트 :</Form.Label>
              <div>
                {scrapFolderList &&
                  scrapFolderList.map((scrapFolderItem) => {
                    return (
                      <Form.Check
                        key={`scrap-folder-${scrapFolderItem.id}`}
                        type="radio"
                        id={`scrap-folder-radio-${scrapFolderItem.id}`}
                        value={scrapFolderItem.name}
                        name="scrap-folder"
                        label={scrapFolderItem.name}
                        onChange={(e) => setScrap(e.target.id.split("-")[3])}
                      />
                    );
                  })}
              </div>
            </Form.Group>

            <Button variant="primary" type="submit">
              확인
            </Button>
            <Button
              name="scrapFolder"
              variant="secondary"
              onClick={handleClose}
            >
              취소
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PostListDetailItem;
