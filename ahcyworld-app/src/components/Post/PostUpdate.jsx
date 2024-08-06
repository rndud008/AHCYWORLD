import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../login/apis/api";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { PostAction } from "../../redux/actions/PostAction";
import { nameCheck } from "./postUtils";
import { LoginContext } from "../../login/context/LoginContextProvider";

const PostUpdate = () => {
  const { hompyId, postName, folderId, postId } = useParams();
  const {hompyInfo} = useContext(LoginContext);

  const [post, setPost] = useState();
  const [originFileList, setOriginFileList] = useState();

  const dispatch = useDispatch();
  const originPost = useSelector(state => state.post.post);


  console.log('PostUpdate -> post: ',post)
  console.log('PostUpdate -> originFileList: ', originFileList)
  console.log('PostUpdate -> originPost: ', originPost)

  const navigate = useNavigate();

  const findPost = async () => {
    // const response = await api.get(
    //   `http://localhost:8070/${hompyId}/${postName}/${folderId}/update/${postId}`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${Cookies.get("accessToken")}`,
    //     },
    //   }
    // );
    // const { data, status } = response;
    // console.log("findPost", data);
    // if (status === 200) {
    //   setPost({...data,fileList: [{ id: 1, sourceName: null }]});
    //   setOriginFileList(data.fileList);
    // }
    dispatch(PostAction.findPostAxios(hompyId,postName,folderId,postId))

  };

  useEffect(()=>{
    findPost();
  },[])

  useEffect(()=>{
    console.log('실행')
    if(originPost !== undefined){
      setPost({...originPost,fileList: [{ id: 1, sourceName: null }]});
      setOriginFileList(originPost?.fileList ? originPost.fileList:[]);
    }
  },[originPost])

  const updateSubmit = async (e) =>{

    e.preventDefault();

    const formData = new FormData();

    const json = JSON.stringify({
      id: post.id,
      subject: post.subject,
      content: post.content,
    })

    formData.append('post', new Blob([json],{type: 'application/json'}));

    post.fileList.forEach((item,idx) => {
      if(item.sourceName){
        formData.append(`files[file${idx}]`,item.sourceName);
        console.log(`Appending file: ${item.sourceName.name}`)
      }
    });

    const delFileIds = originFileList
    .filter(item => item.status === false)
    .map(item => item.id);

    console.log('delFileList: ', delFileIds)

    formData.append(`delFile`,JSON.stringify(delFileIds));

    const response = await api.put(`http://localhost:8070/${hompyId}/${postName}/${folderId}/update`
      ,formData,
      {headers:{
        'Content-Type':'multipart/form-data'
      }}
    )

    const {data,status}= response;

    if(status === 200){
      alert('수정완료',data)
      navigate(`/post/${hompyId}/${postName}/${folderId}/detail/${postId}`)
    }else{
      alert('수정실패')
      navigate(`/post/${hompyId}/${postName}`)
    }

  }

  const changeValue =(e, fileId ="") =>{
    const {value, name} = e.target;

    if(fileId !== ""){
      const selectedFile = e.target.files[0];
      const updateFileList = post.fileList.map(item =>{
        if(item.id === fileId){
          return {...item, sourceName: selectedFile};
        }
        return item;
      });
      setPost({...post,fileList: updateFileList});
    }else{
      setPost({...post,[name]:value})
    }
  }

  const fileAdd =() =>{
    if((post.fileList.length +originFileList.length) <10){
      setPost({
        ...post,
        fileList:[
          ...post.fileList,
        {id: post.fileList.length +1, sourceName: null}
      ]
      })
    }else{
      alert('파일은 10개까지만 추가됩니다.')
    }
  }

  const fileDelete = (e,id) =>{
    const {name} = e.target;

    if(name === 'fileList'){
      const updateFileList = post.fileList.filter(item => item.id !== id);

      setPost({...post,fileList:updateFileList});
    }

    if(name === 'originFileList'){
      // const updateOriginFileList = originFileList.filter(item => item.id !== id);
      const updateOriginFileList = originFileList.map(item => item.id !== id ? item : {...item, status:false});

      setOriginFileList(updateOriginFileList);

    }

  }

  const  fileReCreate = (id) =>{
    const updateOriginFileList = originFileList.map(item => item.id !== id ? item : {...item, status:true});
    setOriginFileList(updateOriginFileList);

  }


  return parseInt(hompyId) === hompyInfo?.id &&  (<Container>
    <div>{postName && nameCheck(postName) + '수정'}</div>
      <Form onSubmit={updateSubmit} encType="multipart/form-data">
        <Form.Group controlId="formSubject">
          <Form.Label>제목 :</Form.Label>
          <Form.Control
            type="text"
            name="subject"
            value={post?.subject}
            onChange={changeValue}
            placeholder="제목을 입력하세요."
          />
        </Form.Group>

        <Form.Group controlId="formContent">
          <Form.Control
            as="textarea"
            name="content"
            value={post?.content}
            onChange={changeValue}
            placeholder="내용을 입력하세요."
            rows={3}
          />
        </Form.Group>

        <div className="write-button-group">
          <div>
            <Button type="button" onClick={fileAdd}>
              파일추가
            </Button>
          </div>
          <div>
            <Button type="submit">수정완료</Button>
            <Button type="button" onClick={() => navigate(-1)}>
              이전으로
            </Button>
          </div>
        </div>

        {originFileList && originFileList?.map((item, idx) => (
          <Form.Group key={item.id} className="files">
            <Form.Control
              type="text"
              name={`originFileList${item.id}`}
              value={item.sourceName}
              readOnly
            />
            {item?.status !== false ? <Button
              type="button"
              variant="danger"
              name="originFileList"
              onClick={(e) => fileDelete(e,item.id)}
            >
              삭제
            </Button> : <Button
              type="button"
              variant="danger"
              name="originFileList"
              onClick={() => fileReCreate(item.id)}
            >
              삭제취소
            </Button>}

          </Form.Group>
        ))}

        {post?.fileList.map((item, idx) => (
          <Form.Group key={item.id} className="files">
            <Form.Control
              type="file"
              name={`fileList${item.id}`}
              onChange={(e) => changeValue(e, item.id)}
            />
            <Button
              type="button"
              variant="danger"
              name="fileList"
              onClick={(e) => fileDelete(e,item.id)}
            >
              삭제
            </Button>
          </Form.Group>
        ))}
      </Form>
  </Container>);
};

export default PostUpdate;
