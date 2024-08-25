import React, { useContext } from 'react'
import { Button, Form, Modal } from 'react-bootstrap';
import { changeValue, detailListHandleClose, postScrap } from '../../../utils/postUtils';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { LoginContext } from '../../../../../../webpage/components/login/context/LoginContextProvider'; 

const DetailScrapModal = ({show,setShow,item}) => {
  const {hompyInfo} = useContext(LoginContext); 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {hompyId,postName,folderId} = useParams();
  const scrapFolderList = useSelector((state) => state.folder.scrapFolderList);
  const scrapFolderId = useSelector(state => state.post.moveFolderId);

  return (
    <>
    <Modal show={show} onHide={(e)=>detailListHandleClose(e,setShow,show)}>
        <Modal.Header closeButton>
          <Modal.Title>스크랩</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e)=>postScrap(e,hompyId,postName,folderId,scrapFolderId,item,dispatch,navigate,hompyInfo,setShow)}>
            <Form.Group className="modalFolderList">
              <Form.Label>{`<폴더 리스트>`}</Form.Label>
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
                        onChange={(e) => changeValue(e,dispatch)}
                        checked={parseInt(scrapFolderItem.id) === parseInt(scrapFolderId)}
                      />
                    );
                  })}
              </div>
            </Form.Group>

            <div className="modalFolderListButton">

            <Button className='diarywriteok-btn' type="submit">
              확인
            </Button>
            <Button
              className='diarywriteno-btn'
              name="scrapFolder"
              variant="secondary"
              onClick={(e)=>detailListHandleClose(e,setShow,show)}
            >
              취소
            </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default DetailScrapModal