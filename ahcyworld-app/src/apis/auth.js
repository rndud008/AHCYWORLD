import api, { SERVER_HOST } from "./api";

export const login = (username, password) =>
    api.post(
        `${SERVER_HOST}/login`,
        { username, password },
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

export const userInfo = () => api.get(`${SERVER_HOST}/user`);

export const hompyInfo = () => api.get(`${SERVER_HOST}/hompy`);

export const authInfo = () => api.get(`${SERVER_HOST}/auth`);

export const join = (data) => api.post(`${SERVER_HOST}/user/join`, data);

export const checkUsernameAvailable = (username) => {
    return api.get(`${SERVER_HOST}/user/check-username`, {
        params: { username },
    });
};

export const checkEmailAvailable = (email) => {
    return api.get(`${SERVER_HOST}/user/check-email`, {
        params: { email },
    });
};

export const findFriendList = (username) => {
    return api.get(`${SERVER_HOST}/friend/myfriends`, {
        params: { username },
    });
};

export const userList = () => {
    return api.get(`${SERVER_HOST}/user/list`);
};

export const hompyList = () => {
    return api.get(`${SERVER_HOST}/hompy/list`);
};

export const checkFriendShip = (username, friendUsername) => {
    return api.get(`${SERVER_HOST}/friend/check-friendship`, {
        params: { username, friendUsername },
    });
};

export const myFriendRequests = (username) => {
    return api.get(`${SERVER_HOST}/friend/friend-requests`, {
        params: { username },
    });
};

export const getPaymentList = () => api.get(`${SERVER_HOST}/payment/list`);

export const getUserWriteHistory = () => api.get(`${SERVER_HOST}/userwritehistory/list`);

export const soldItemList = () => api.get(`${SERVER_HOST}/cart/sold-list`);

export const getMessageFromAdmin = (userId) => {
    return api.get(`${SERVER_HOST}/message/mymessage`, {
        params: { userId },
    });
};

export const addFriend = (friendType1, friendType2, message, username, friendUsername) => {
    return api.post(
        `${SERVER_HOST}/friend/addfriend`,
        { friendType1, friendType2, message, username, friendUsername },
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
};

export const friendShipResponse = (id, reply) => {
    return api.post(
        `${SERVER_HOST}/friend/friend-response`,
        { id, reply },
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
};

export const addInfo = (username, gender, birthDay) => {
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("gender", gender);
    params.append("birthDay", birthDay);

    return api.post(
        `${SERVER_HOST}/user/addinfo`,
        { username, gender, birthDay },
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
};

export const resetHompy = (hompyId) => {
    const params = new URLSearchParams();
    params.append("hompyId", hompyId);

    return api.post(
        `${SERVER_HOST}/hompy/reset`,
        { hompyId },
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
};

export const sendMessageToUser = (title, message, senderId, receiverId) => {
    const params = new URLSearchParams();
    params.append("title", title);
    params.append("message", message);
    params.append("senderId", senderId);
    params.append("receiverId", receiverId);

    return api.post(`${SERVER_HOST}/message/save`, params.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
};

export const readMessage = (id) => {
    return api.post(
        `${SERVER_HOST}/message/read`,
        { messageId: id },
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
};
