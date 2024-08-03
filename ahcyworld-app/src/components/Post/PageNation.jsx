import React from 'react'
import { Button, Container } from 'react-bootstrap'

const PageNation = () => {
  return (
    <Container>
      <div>
        <div>
          <h4>제목</h4>
          </div>
        <div>
          <Button>목록</Button>
          <Button>이동</Button>
          <Button>수정</Button>
          <Button>삭제</Button>
          </div>
      </div>
      <div>
        <div>
          <h5>작성자</h5>
          </div>
        <div>
          <h5>작성일자</h5>
          </div>
        <div>
          <h5>조회수</h5>
          </div>
      </div>
      <div>
        <span>첨부파일</span>
      </div>
      <div>
        <sapn>content</sapn>
      </div>
      <div>
        <div><Button>댈글보기</Button></div>
        <div>댓글 목록</div>
        <div>
          <label>댓글</label>
          <input placeholder='댓글입력'/>
          <Button>확인</Button>
        </div>
      </div>
    
    </Container>
  )
}

export default PageNation