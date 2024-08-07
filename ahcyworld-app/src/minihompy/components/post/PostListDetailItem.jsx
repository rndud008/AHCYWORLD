import React, { useContext, useState } from "react";
import { Button, ButtonGroup, Container, Form, Modal } from "react-bootstrap";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import api from "../../../apis/api";
import { useDispatch, useSelector } from "react-redux";
import { PostAction } from "../../../redux/actions/PostAction";
import { FolderAction } from "../../../redux/actions/FolderAction";
import { LoginContext } from "../../../login/context/LoginContextProvider";

const PostListDetailItem = ({ item, moveFolderId, setMoveFolderId }) => {
    const { hompyInfo } = useContext(LoginContext);
    const { postName, hompyId } = useParams();
    const [show, setShow] = useState({
      folderMove: false,
      scrapFolder: false,
    });
    const [scrap, setScrap] = useState();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const folderList = useSelector((state) => state.folder.folderList);
    const scrapFolderList = useSelector((state) => state.folder.scrapFolderList);
  
    const folderId = item?.folder.id;
    const postId = item?.id;
  
    console.log(hompyInfo.id, "hompid");
  
    const postDelete = async () => {
      if (!window.confirm("삭제 하시겠습니까?")) return;
      // const response = await api.delete(
      //   `http://localhost:8070/${hompyId}/${postName}/${item.foler.id}/delete/${item.id}`
      // );
      // const { status } = response;
  
      // if (status === 200) {
      //   alert('삭제 완료.');
      //   navigate(`http://localhost:8070/${hompyId}/${postName}/${item.foler.id}`);
      // } else {
      //   alert("삭제 실패.");
      //   navigate(-1);
      // }
  
      dispatch(
        PostAction.deletePostAxios(hompyId, postName, folderId, postId, navigate)
      );
    };
  
    const moveFolder = async (e) => {
      e.preventDefault();
  
      // const response = await api.put(`http://localhost:8070/${hompyId}/${postName}/${item.foler.id}/detail/${item.id}/${'moveFolderId'}`)
      // const {data,status} = response;
      // console.log('폴더 변경완료 :', data)
      // if(parseInt(status) === 200){
      //   alert('폴더 변경 성공.')
      //   navigate(`/post/${hompyId}/${postName}/${data.folder.id}/detail/${data.id}`)
      // }else{
      //   alert('폴더 변경 실패')
      //   navigate(`/post/${hompyId}/${postName}`)
      // }
  
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
        // const response = await api.get(`http://localhost:8070/${hompyId}/${postName}/scrapfolder`,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${Cookies.get("accessToken")}`,
        //     },
        //   })
        //   const {data} = response;
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
        post
      );
  
      const { data, status, statusText } = response;
      console.log(data);
  
      if (status === 200) {
        alert("스크랩 완료");
      } else {
        alert(statusText);
      }
    };
  
    return (
      <Container>
        <div>
          <span>작성번호 : {item.id}</span>
          <span>제목 : {item.subject}</span>
        </div>
        <div>
          <span>작성자 : {item.folder.hompy.user.name}</span>
          <span>스크랩 : {item.scrap}</span>
        </div>
        <div>
          {item.fileList.map((item) => {
            if (postName.includes("photo") && item.image === true) {
              return (
                <img
                  key={item.id}
                  src={`http://localhost:8070/post/${item.fileName}`}
                  alt={item.fileName}
                  style={{ width: "200px", height: "auto", margin: "10px" }}
                />
              );
            } else if (postName.includes("video") && item.video === true) {
              return (
                <video width="300" controls autoplay loop>
                  <source src={`http://localhost:8070/video/${item.fileName}`} />
                </video>
              );
            }
            return null;
          })}
          {item.content}
        </div>
        <div>
          <ButtonGroup>
            <Button>댓글닫기</Button>
            <Button name="scrapPost" onClick={handleOpen}>
              스크랩
            </Button>
  
            {parseInt(hompyId) === hompyInfo?.id && (
              <>
                <Button
                  onClick={() =>
                    navigate(
                      `/post/${hompyId}/${postName}/${folderId}/update/${postId}`
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
          <div>댓글 목록</div>
          <div>
            <label>댓글</label>
            <input placeholder="댓글입력" />
            <Button>확인</Button>
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
                        folderList.map((item) => {
                          return (
                            <Form.Check
                              type="radio"
                              id={`move-folder-radio-${item.id}`}
                              value={item.name}
                              name="folder"
                              label={item.name}
                              onChange={changeValue}
                              checked={item.id === parseInt(moveFolderId)}
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
                    scrapFolderList.map((item) => {
                      return (
                        <Form.Check
                          type="radio"
                          id={`scrap-folder-radio-${item.id}`}
                          value={item.name}
                          name="scrap-folder"
                          label={item.name}
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
  
      </Container>
    );
  };

export default PostListDetailItem;
