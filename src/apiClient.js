import axios from "axios";
import API from "./API";

const apiClient = axios.create({ withCredentials: true });

const AUTH_URLS = ["/user/sign-in", "/user/google-sign-in", "/user/refresh", "/user/logout", "/user/me"];
const isAuthUrl = (url = "") => AUTH_URLS.some((path) => url.includes(path));

let isRefreshInProgress = false;
let requestsWaitingForRefresh = [];

const finishRefresh = (error = null) => {
  requestsWaitingForRefresh.forEach((retry) => retry(error));
  requestsWaitingForRefresh = [];
};

const shouldTryRefresh = (error, request) =>
  error.response?.status === 401 && !request?._retry && !isAuthUrl(request?.url);

const waitForRefreshThenRetry = (request) =>
  new Promise((resolve, reject) => {
    requestsWaitingForRefresh.push((refreshError) => {
      if (refreshError) reject(refreshError);
      else {
        request._retry = true;
        resolve(apiClient(request));
      }
    });
  });

const refreshSessionAndRetry = async (request) => {
  isRefreshInProgress = true;
  request._retry = true;

  try {
    await apiClient.post(API.REFRESH_SESSION);
    finishRefresh();
    return apiClient(request);
  } catch (refreshError) {
    finishRefresh(refreshError);
    throw refreshError;
  } finally {
    isRefreshInProgress = false;
  }
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    if (!shouldTryRefresh(error, request)) return Promise.reject(error);
    if (isRefreshInProgress) return waitForRefreshThenRetry(request);
    return refreshSessionAndRetry(request);
  }
);

export default apiClient;
