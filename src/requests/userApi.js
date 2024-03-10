import { SERVER_URL } from '../constants';
import apiRequest from '../services';

const getUserByUsername = async (username) => {
  try {
    const { data } = await apiRequest({
      method: 'post',
      url: `${SERVER_URL}/api/users/username`,
      data: username,
    });
    return data;
  } catch (error) {
    throw new Error(`Error creating place: ${error}`);
  }
};

const verifyUser = async () => {
  try {
    const { data } = await apiRequest({
      method: 'post',
      url: `${SERVER_URL}/api/auth/verify`,
      withCredentials: true,
    });
    return data;
  } catch (error) {
    throw new Error(`Error verifying user: ${error}`);
  }
};

const login = async (values) => {
  const { username, password } = values;
  try {
    const { data } = await apiRequest({
      method: 'post',
      url: `${SERVER_URL}/api/auth/login`,
      data: { username, password },
      withCredentials: true,
    });
    return data;
  } catch (error) {
    throw new Error(`Error logging in: ${error}`);
  }
};

const userApi = {
  getUserByUsername,
  verifyUser,
  login,
};

export default userApi;
