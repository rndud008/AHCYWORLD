import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../login/apis/api";
import Cookies from "js-cookie";
import { Button, Container } from "react-bootstrap";

const PostDetail = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState();
  const { hompyId, postName, folderId, postId } = useParams();
  const detailPage = async () => {
    const response = await api.get(
      `http://localhost:8090/${hompyId}/${postName}/${folderId}/detail/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }
    );

    const { data, status } = response;

    if (status === 200) {
      setPost(data);
      console.log(data);
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    detailPage();
  }, []);

  const list = () =>{
    navigate(`/post/${hompyId}/${postName}/`);
  }

  const postDelete = async() => {

    if(!window.confirm('삭제 하시겠습니까?')) return;
    const response = await api.delete(`http://localhost:8090/${hompyId}/${postName}/${folderId}/delete/${postId}`)
    const {status} = response;

    if(status === 200 ){
      alert('삭제 성공.')
      navigate('/')
    }else{
      alert('삭제 실패.')
      navigate('/')
    }
  }

  return (
    <Container>
      <div>
        <div>
          <h4>{post?.subject}</h4>
        </div>
        <div>
          <Button onClick={list}>목록</Button>
          <Button>이동</Button>
          <Button>수정</Button>
          <Button onClick={postDelete}>삭제</Button>
        </div>
      </div>
      <div>
        <div>
          <h6>작성자 : {post?.folder.hompy.user.name}</h6>
        </div>
        <div>
          <h6>작성일자 : {post?.createAt}</h6>
        </div>
        <div>
          <h6>조회수 : {post?.viewCnt}</h6>
        </div>
      </div>
      <div>
        <span>첨부파일</span>
      </div>
      <div>
        <span>{post?.content}</span>
      </div>
      <div>
        <div>
          <Button>댓글보기</Button>
        </div>
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

export default PostDetail;
