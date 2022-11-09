import axios from "axios";
import { onGlobalSuccess, onGlobalError, API_HOST_PREFIX } from "./serviceHelpers";

const horseService = {
  endpoint: `${API_HOST_PREFIX}/api/horses`,
};

const getAllHorses = () => {
    const config = {
        method: "GET",
        url: horseService.endpoint,
        headers: {"Content-Type":"application/json"}
    }
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};
const getByHorseId = id => {
    const config ={
        method: "GET",
        url: `${horseService.endpoint}/${id}`,
        headers: {"Content-Type":"application/json"}
    }
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};
const deleteHorse = (id) => {
  const config = {
    method: "DELETE",
    url: `${horseService.endpoint}/${id}`,
    headers: {"Content-Type": "application/json"}
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};
const getUserHorses = (pageIndex,pageSize) => {
    const config = {
        method: "GET",
        url: `${horseService.endpoint}/current?pageIndex=${pageIndex}&pageSize=${pageSize}`, 
        headers: {"Content-Type":"application/json"}
    }
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getVetHorses = (pageIndex,pageSize) => {
    const config = {
        method: "GET",
        url: `${horseService.endpoint}/vet?pageIndex=${pageIndex}&pageSize=${pageSize}`, 
        headers: {"Content-Type":"application/json"}
    }
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const searchUserHorses = (pageIndex,pageSize,searchTerm) => {
  const config = {
    method: "GET",
    url: `${horseService.endpoint}/search?pageIndex=${pageIndex}&pageSize=${pageSize}&query=${searchTerm}`,
    withCredentials: true,
    crossdomain: true,
    headers: {"Content-Type": "application/json"}
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const addHorse = (payload) => {
  const config = {
    method: "POST",
    url: horseService.endpoint,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: {"Content-Type": "application/json"}
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const updateHorse = (payload) => {
  const config = {
    method: "PUT",
    url: `${horseService.endpoint}/${payload.id}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: {"Content-Type": "application/json"}
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

export {
    getAllHorses,
    searchUserHorses,
    getUserHorses,
    getByHorseId,
    deleteHorse,
    addHorse,
    updateHorse,
    getVetHorses,
};