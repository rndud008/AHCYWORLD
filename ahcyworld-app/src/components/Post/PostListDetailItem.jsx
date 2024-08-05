import React, { useState } from "react";
import { Button, ButtonGroup, Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../login/apis/api";

const PostListDetailItem = ({ item, folderList, moveFolderId, setMoveFolderId }) => {

  const {postName,hompyId} = useParams();
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  console.log("PostListDetailItem", item);
  console.log("PostListDetailItem", postName);

  const postDelete = async () => {
    if (!window.confirm("삭제 하시겠습니까?")) return;
    const response = await api.delete(
      `http://localhost:8070/${hompyId}/${postName}/${item.foler.id}/delete/${item.id}`
    );
    const { status } = response;

    if (status === 200) {
      alert('삭제 완료.');
      navigate(`http://localhost:8070/${hompyId}/${postName}/${item.foler.id}`);
    } else {
      alert("삭제 실패.");
      navigate(-1);
    }
  };

  const moveFolder = async (e) => {
    e.preventDefault();

    const response = await api.put(`http://localhost:8070/${hompyId}/${postName}/${item.foler.id}/detail/${item.id}/${'moveFolderId'}`)

    const {data,status} = response;
    console.log('폴더 변경완료 :', data)

    if(parseInt(status) === 200){
      alert('폴더 변경 성공.')
      navigate(`/post/${hompyId}/${postName}/${data.folder.id}/detail/${data.id}`)
    }else{
      alert('폴더 변경 실패')
      navigate(`/post/${hompyId}/${postName}`)
    }
    setShow(false);
  };

  const handleOpen = () => {
    console.log("data: ", folderList);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
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
          
          if (postName.includes('photo') && item.image === true) {
            return (
              <img
                key={item.id}
                src={`http://localhost:8070/post/${item.fileName}` }
                alt={item.fileName}
                style={{ width: "200px", height: "auto", margin: "10px" }}
              />
            );
          }else if(postName.includes('video') && item.video === true){
            return(
              <video width="300" controls autoplay loop>
                <source src={`http://localhost:8070/video/${item.fileName}`}/>
              </video>
            )
          }
          return null;
        })}
        {item.content}
      </div>
      <div>
        <ButtonGroup>
          <Button>댓글닫기</Button>
          <Button>스크랩</Button>
          <Button>수정</Button>
          <Button onClick={handleOpen}>이동</Button>
          <Button onClick={postDelete}>삭제</Button>
        </ButtonGroup>
        <div>댓글 목록</div>
        <div>
          <label>댓글</label>
          <input placeholder="댓글입력" />
          <Button>확인</Button>
        </div>
      </div>
    </Container>
  );
};

export default PostListDetailItem;
