import { apiRequest } from "./requestMethods"

export const loginRequest = async (username) => {
  try {
    const res = await apiRequest.post("/login", username);
    return res
  } catch (err) {
    return false
  }
};

export const registerRequest = async (user) => {
  try {
    const res = await apiRequest.post("/register", user);
    return res
  } catch (err) {
    return false
  }
};

export const getUser = async (username) => {
  try {
    const res = await apiRequest.get(`/users/${username}`);
    return res
  } catch (err) {
    return false
  }
};

export const searchUser = async (data) => {
  try {
    const res = await apiRequest.post(`/search`, data);
    return res
  } catch (err) {
    return false
  }
};

export const changeInfoVisility = async (data) => {
  try {
    const res = await apiRequest.put(`/user-info-visibility`, data);
    return res
  } catch (err) {
    return false
  }
};

export const getInfoVisibility = async (data) => {
  try {
    const res = await apiRequest.get(`/user-info-visibility/${data}`);
    return res
  } catch (err) {
    return false
  }
};

export const createRelation = async (data) => {
  try {
    const res = await apiRequest.post(`/follow`, data);
    return res
  } catch (err) {
    return false
  }
};


export const userGraph = async (data) => {
  try {
    const res = await apiRequest.get(`/user-centered-graph/${data}`);
    return res
  } catch (err) {
    return false
  }
} 

export const socialNetworkGraph = async () => {
  try {
    const res = await apiRequest.get(`/social-network-graph`);
    return res
  } catch (err) {
    return false
  }
} 

export const editUserInformation = async (data) => {
  console.log(data)
  try {
    const res = await apiRequest.put(`/users/${data.username}`, data.info);
    return res
  } catch (err) {
    return false
  }
}

export const createPost = async (data) => {
  try {
    const res = await apiRequest.post(`/create-post`, data);
    return res
  } catch (err) {
    return false
  }
};