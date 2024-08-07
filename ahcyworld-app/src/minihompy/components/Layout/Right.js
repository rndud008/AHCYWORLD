import React from "react";
import './css/Right.css';

const Right = () => {
  return (
    <div className="right-container">
      <div className="content-section">

        {/* 업데이트 뉴스 */}
        <div className="news-section">
          <p className="head-p">Updated news</p>
          <hr className="divider" />
          <ul className="news-list">
            <li><span>[스크랩]</span> 단체 사진-</li>
            <li><span>[스크랩]</span> 하늘공원 갔었습니다^^</li>
            <li><span>[스크랩]</span> 하늘공원</li>
            <li><span>[스크랩]</span> 하늘공원</li>
            <li><span>[스크랩]</span> 하늘공원</li>
          </ul>
        </div>
      
        {/* 업데이트 목록 게시판 테이블 */}
        <div className="info-table">
          <table>
            <tbody>
              <tr>
                <td>다이어리 <span className="count">0/0 <span className="new-icon">N</span></span></td>
                <td>사진첩 <span className="count">0/0 <span className="new-icon">N</span></span></td>
              </tr>
              <tr>
                <td>게시판 <span className="count">0/0 <span className="new-icon">N</span></span></td>
                <td>방명록 <span className="count">0/0 <span className="new-icon">N</span></span></td>
              </tr>
              <tr>
                <td>동영상 <span className="count">0/0 <span className="new-icon">N</span></span></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 미니룸 */}
      <div className="miniroom-section">
        <span className="miniroom-tabs">Mini Room</span>
        <div className="miniroom">
          <img src={`${process.env.PUBLIC_URL}/image/miniroom.png`} alt="Miniroom Background" className="miniroom-bg-image" />
            <img src={`${process.env.PUBLIC_URL}/image/male.png`} alt="Character" className="miniroom-character" />
        </div>
      </div>

      {/* 일촌평 */}
  <div className="friend-msg">
  <span className="friends-msg">일촌평</span>
  <div className="input-container">
    <input className="text-box" type="text" placeholder="일촌평 작성.." />
    <button className="submit-btn">등록</button>
  </div>
</div>
    </div>
  );
};

export default Right;
