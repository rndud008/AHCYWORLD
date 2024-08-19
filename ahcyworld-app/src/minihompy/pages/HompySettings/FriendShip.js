import React, { useEffect, useState } from 'react';
import '../css/FriendShip.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import FriendNameModal from './FriendNameModal';


const FriendShip = ({user}) => {
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
 
  // 일촌목록 불러오기
  useEffect(() => {
    const fetchFriendList = async () => {
      if (user?.username) {
        // user 객체가 존재하고, 그 안에 username이 있을 경우 실행
        try {
          const response = await axios.get(`http://localhost:8070/friend/myfriends`, {
            params: { username: user.username }
          });

          // 서버로부터 친구 목록 데이터를 가져옴
          // response.data에 친구 목록이 포함되어 있음
          const friendsWithHompyId = await Promise.all(
            response.data.map(async (friend) => {
              try {
                // 각 친구의 userId(friend.friendUser.id)를 사용하여 해당 유저의 hompyId를 조회
                const hompyResponse = await axios.get(`http://localhost:8070/hompy/user/${friend.friendUser.id}`);

                // hompyId를 친구 데이터에 추가하여 반환
                return { ...friend, hompyId: hompyResponse.data };
              } catch (hompyError) {
                console.error(`Failed to fetch hompyId for user ${friend.friendUser.id}:`, hompyError);

                // hompyId를 가져오지 못한 경우 null로 설정
                return { ...friend, hompyId: null };
              }
            })
          );

          // 모든 친구의 hompyId를 포함한 데이터를 상태로 설정
          setFriends(friendsWithHompyId);
        } catch (error) {
          console.error("친구 목록 불러오기 실패", error);
        }
      }
    };

    fetchFriendList();
  }, [user?.username]);

  // 일촌명 변경 모달
  const openModal = (friend) => {
    setSelectedFriend(friend);
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
  }

  // 일촌명 변경
  const handleSaveFriendName = async (newFriendName) => {
    try {
      const params = new URLSearchParams();
      params.append('friendId', selectedFriend.id);
      params.append('newFriendName', newFriendName);
  
      await axios.post('http://localhost:8070/friend/change-friend-name', params);
      
      setFriends(friends.map(friend => 
        friend.id === selectedFriend.id 
          ? { ...friend, friendName: newFriendName } 
          : friend
      ));
  
      // 성공 시 알림
      Swal.fire({
        title: '성공!',
        text: '일촌명이 변경되었습니다.',
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: '확인'
      });
  
    } catch (error) {
      console.error("일촌명 변경 실패: ", error);
  
      // 실패 시 알림
      Swal.fire({
        title: '실패!',
        text: '일촌명 변경에 실패했습니다. 다시 시도해 주세요.',
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: '확인'
      });
    }
  };

  // 일촌끊기
  const handleRemoveFriend = async (friendUserId) => {
    const userId = user.id; // 현재 로그인한 유저의 Id 가져오기

    Swal.fire({
      title: "일촌 끊기",
      text: "정말로 일촌을 끊으시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "네!",
      cancelButtonText: "아니요!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8070/friend/remove-friend/${userId}/${friendUserId}`);
          setFriends(prevFriends => prevFriends.filter(friend => friend.friendUser.id !== friendUserId && friend.id !== friendUserId));
          Swal.fire(
            "성공!",
            "상대방과의 일촌이 끊겼습니다!",
            "success"
          );
        } catch (error) {
          console.error("일촌 끊기 실패: ", error.response ? error.response.data : error.message);
          Swal.fire(
            "실패!",
            error.response?.data?.message || "상대방과의 일촌을 끊지 못했습니다!",
            "error"
          );
        }
      }
    });
  };

  return (
    <>
     <div className='FriendShip-container'>
        <ol className='friend-list'>
          {friends.length > 0 ? (
            friends.map((friend, index) => (
              <li key={friend.id} className='friend-item'>
                <span className='friend-number'>{index + 1}. </span>
                <span className='friend-name'>{friend.friendUser.name}({friend.friendName})</span>
                <button className='friend-button' onClick={() => openModal(friend)}>
                  일촌명 변경
                </button>
                <button className='friend-button' onClick={() => handleRemoveFriend(friend.friendUser.id)}>
                  일촌끊기
                </button>
              </li>
            ))
          ) : (
            <p>일촌 목록이 없습니다.</p>
          )}
        </ol>
      </div>

        <FriendNameModal 
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSaveFriendName}
          currentFriendName={selectedFriend?.friendName}
        />
    </>
  );
};

export default FriendShip;