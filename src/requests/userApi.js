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

const userApi = {
  getUserByUsername,
};

export default userApi;
