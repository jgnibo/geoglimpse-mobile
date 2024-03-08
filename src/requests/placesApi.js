import { SERVER_URL } from '../constants';
import apiRequest from '../services';

const createPlace = async (placeData) => {
  try {
    const { data } = await apiRequest({
      method: 'post',
      url: `${SERVER_URL}/api/places`,
      data: placeData,
    });
    return data;
  } catch (error) {
    throw new Error(`Error creating place: ${error}`);
  }
}

const getAuthoredPlaces = async (creatorId) => {
  try {
    const { data } = await apiRequest({
      method: 'get',
      url: `${SERVER_URL}/api/places/creator/${creatorId}`,
    });
    return data;
  } catch (error) {
    throw new Error(`Error getting authored places: ${error}`);
  }
}

const getViewablePlaces = async (creatorId) => {
  try {
    const { data } = await apiRequest({
      method: 'get',
      url: `${SERVER_URL}/api/places/viewable/${creatorId}`,
    });
    return data;
  } catch (error) {
    throw new Error(`Error getting viewable places: ${error}`);
  }
}

const getPublicPlaces = async () => {
  try {
    const { data } = await apiRequest({
      method: 'get',
      url: `${SERVER_URL}/api/places/public`,
    });
    return data;
  } catch (error) {
    throw new Error(`Error getting viewable places: ${error}`);
  }
}

const placesApi = {
  getAuthoredPlaces,
  getViewablePlaces,
  getPublicPlaces,
};


export default placesApi;