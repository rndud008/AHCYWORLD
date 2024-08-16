let initialState={
  searchList:[]
}

const SearchReducer = (state=initialState,action) =>{

  let {type,payload} = action;

  switch(type){
    case "GET_SEARCH_ALL_LIST_SUCCESS":
      return{...state,searchList:{
        itemList:payload.data.itemList !== null ? payload.data.itemList : [],
        hompyList:payload.data.hompyList !== null ? payload.data.hompyList : []
      }};
    case "GET_SEARCH_HOMPY_LIST_SUCCESS":
      return{...state,searchList:{hompyList:payload.hompyList}};
    case "GET_SEARCH_ITEM_LIST_SUCCESS":
      return{...state,searchList:{itemList:payload.itemList}};
    default:
      return{...state};
  }

}

export default SearchReducer;