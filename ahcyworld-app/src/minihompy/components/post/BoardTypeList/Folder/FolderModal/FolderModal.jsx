import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { changeValue, createSubmit, handleClose, updateSubmit, radioName } from "../../../utils/FolderUtils"
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";


const FolderModal = () => {
  const {hompyId,postName} = useParams();
  const dispatch = useDispatch();
  const folder = useSelector(state=> state.folder.folder);
  const show = useSelector(state => state.folder.show)
  const modalName = useSelector(state => state.folder.modalName);
  const errors = useSelector(state => state.folder.errors);

  return (
    <>
      <Modal show={show} onHide={() => handleClose(dispatch)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={modalName === "폴더 생성" ? 
              (e) => createSubmit(e, dispatch,hompyId,postName,folder) 
              : (e) => updateSubmit(e,dispatch,hompyId,postName,folder)}
          >
            <Form.Group controlId="formFolderName">
              <Form.Label>폴더이름 :</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={folder?.name}
                onChange={(e) => changeValue(e,dispatch)}
                placeholder="폴더 이름을 입력하세요"
              />
              {errors.name && <p>{errors.name}</p>}
            </Form.Group>

            <Form.Group>
              <Form.Label>공개범위 :</Form.Label>

              <div>
                {radioName.map((item) => (
                  <Form.Check
                    type="radio"
                    id={item.id}
                    value={item.name}
                    name="status"
                    label={item.name}
                    onChange={(e) => changeValue(e,dispatch)}
                    checked={folder?.status === item.name}
                  />
                  
                ))}
                {errors.status && <p>{errors.status}</p>}
              </div>
            </Form.Group>

            <Button variant="primary" type="submit">
              {modalName === "폴더 생성" ? "추가" : "수정"}
            </Button>
            <Button variant="secondary" onClick={() => handleClose(dispatch)}>
              취소
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default FolderModal;
