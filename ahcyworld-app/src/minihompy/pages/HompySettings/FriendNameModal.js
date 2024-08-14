import React, { useEffect, useState } from 'react';
import '../css/FriendNameModal.css';

const FriendNameModal = ({ isOpen, onClose, onSave, currentFriendName }) => {
  const [newFriendName, setNewFriendName] = useState("");

  // 모달이 열릴 때마다 변경된 일촌명 초기화
  useEffect(() => {
    if (isOpen) {
      setNewFriendName(currentFriendName);
    }
  }, [isOpen, currentFriendName]);

  const handleSave = () => {
    onSave(newFriendName);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <input
          type="text"
          value={newFriendName || ""}
          onChange={(e) => setNewFriendName(e.target.value)}
        />
        <div className='friend-modal-button'>
          <button onClick={handleSave} className='handelsave-btn'>
            저장
          </button>
          
          <button onClick={onClose} className='onclose-btn'>
            취소
          </button>
        </div> 
      </div>
    </div>
  );
};

export default FriendNameModal;
