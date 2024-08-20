import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import {
  changeValue,
  createSubmit,
  handleClose,
  updateSubmit,
  radioName,
} from "../../../utils/FolderUtils";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./FolderModal.style.css";

const FolderModal = () => {
  const { hompyId, postName } = useParams();
  const dispatch = useDispatch();
  const folder = useSelector((state) => state.folder.createFolder);
  const show = useSelector((state) => state.folder.show);
  const modalName = useSelector((state) => state.folder.modalName);
  const errors = useSelector((state) => state.folder.errors);

  return (
    <>
      <Modal show={show} onHide={() => handleClose(dispatch)}>
        <Modal.Header closeButton className="folder-modal-header">
          <Modal.Title>
            {modalName !== "" ? "폴더 생성" : "폴더 수정"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={
              modalName === "폴더 생성"
                ? (e) => createSubmit(e, dispatch, hompyId, postName, folder)
                : (e) => updateSubmit(e, dispatch, hompyId, postName, folder)
            }
          >
            <Form.Group
              className="folder-modal-form"
              controlId="formFolderName"
            >
              <Form.Label>폴더이름 :</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={folder?.name}
                onChange={(e) => changeValue(e, dispatch)}
                placeholder="폴더 이름을 입력하세요"
              /><br/>
            </Form.Group>
              {errors.name && <p className="folder-error-message">{errors.name}</p>}

            <Form.Group className="folder-status">
              <Form.Label>공개범위 :</Form.Label>

              <div className="folder-status-value">
                {radioName.map((item) => (
                  <Form.Check
                  key={item.id}
                    type="radio"
                    id={item.id}
                    value={item.name}
                    name="status"
                    label={item.name}
                    onChange={(e) => changeValue(e, dispatch)}
                    checked={folder?.status === item.name}
                  />
                ))}
              </div>
            </Form.Group>
                {errors.status && <p className="folder-error-message">{errors.status}</p>}
            <div className="folder-button-group">
              <Button variant="primary" type="submit">
                {modalName === "폴더 생성" ? "추가" : "수정"}
              </Button>
              <Button variant="secondary" onClick={() => handleClose(dispatch)}>
                취소
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default FolderModal;
