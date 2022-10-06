export const initialState = null;

export const reducer = (state, action) => {
  if (action.type === "USER") {
    return { ...action.payload };
  }
  if (action.type === "CLEAR") {
    return null;
  }
  if (action.type === "DELETE_POST_BY_ID") {
    return {
      ...state,
      ...action.payload,
    };
  }
  if (action.type === "UPDATE") {
    return {
      ...state,
      followers: action.payload.followers,
      following: action.payload.following,
    };
  }
  if (action.type === "UPDATEPIC") {
    return {
      ...state,
      pic: action.payload,
    };
  }

  if (action.type === "EDITNAME") {
    return {
      ...state,
      name: action.payload,
    };
  }

  return state;
};
