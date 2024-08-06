export const nameCheck = (postName) => {
  if (postName === "board") return "게시물";
  if (postName === "video") return "비디오";
  if (postName === "photo") return "사진";
};

export const boardNameCheck = (name)=>{
  if(name === "게시판"){
    return 'board'
  }
  if(name === "사진첩"){
    return 'photo'
  }
  if(name === "동영상"){
    return 'video'
  }

}