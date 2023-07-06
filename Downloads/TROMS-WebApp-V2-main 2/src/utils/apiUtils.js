import ApiConstants from "../api/apiConstants"
import { create } from "apisauce"
import { useDispatch } from "react-redux"
import { appCreators } from "store/app/appReducer"
import { mainReducerCreators,mainReducerTypes } from "store/reducers";
export const apiClients = {
  configApi: null,
  default: null,
  authtoken: null
}
let store;
function handleApi(response){
  console.log("api call")
  // debugger;
  if(response.status == "401"){
    store.dispatch(mainReducerCreators.userLogout())
  } else {
    store.dispatch(appCreators.updateTokenExpiry())
  }
}

export const generateApiClient = (type = "configApi", token) => {
  return createApiClientWithTransForm(ApiConstants.BASE_URL, token)
}

//only needed for dev purposes
export const generateEmailApiClient = (type = "configApi", token) => {
  return createApiClientWithTransForm(ApiConstants.BASE_EMAIL_URL, token) 
}

export const createApiClientWithTransForm = (baseURL, token) => {
  return create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    }
  })
}


export let apiClient = generateApiClient()
export let apiEmailClient = generateApiClient()


export const setClient = (token) => {
  apiClient = generateApiClient("configApi", token)
  apiEmailClient = generateEmailApiClient("configApi", token)
  apiClient.addMonitor(handleApi)
}

export const setStore = (stor) =>{
  store = stor;
}

export const getClient = () => apiClient
export const getEmailClient = () => apiEmailClient


