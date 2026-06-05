const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

const API = {
  SIGN_IN: `${BASE_URL}/user/sign-in`,
  SIGN_UP: `${BASE_URL}/user/sign-up`,
  RESEND_VERIFICATION: `${BASE_URL}/user/resend-verification`,
  CURRENT_USER: `${BASE_URL}/user/me`,
  REFRESH_SESSION: `${BASE_URL}/user/refresh`,
  LOGOUT: `${BASE_URL}/user/logout`,
  GOOGLE_SIGN_IN: `${BASE_URL}/user/google-sign-in`,
  UPDATE_USER: `${BASE_URL}/user/update-user`,
  LINK_EMAIL_LOGIN: `${BASE_URL}/user/link-email-login`,
  UPDATE_PASSWORD: `${BASE_URL}/user/update-password`,
  FORGET_PASSWORD: `${BASE_URL}/user/forget-password`,

  ADD_FAMILY: `${BASE_URL}/family/add`,
  GET_FAMILY: `${BASE_URL}/family/fetch`,
  ADD_MEMBER: `${BASE_URL}/family/add-member`,
  REMOVE_MEMBER: `${BASE_URL}/family/remove-member`,
  LEAVE_FAMILY: `${BASE_URL}/family/leave-family`,
  CHANGE_FAMILY_NAME: `${BASE_URL}/family/change-name`,
  JOIN_BY_CODE: `${BASE_URL}/family/join-bycode`,
  TRANSFER_HEAD: `${BASE_URL}/family/transfer-head`,
  DELETE_FAMILY: `${BASE_URL}/family/delete`,

  ADD_EMERGENCY_CONTACT: `${BASE_URL}/emergency-contact/add`,
  UPDATE_EMERGENCY_CONTACT: `${BASE_URL}/emergency-contact/update`,
  FETCH_EMERGENCY_CONTACT_BY_ID: `${BASE_URL}/emergency-contact`,
  DELETE_EMERGENCY_CONTACT: `${BASE_URL}/emergency-contact/delete`,

  SOS_ALERT_TRIGGER: `${BASE_URL}/trigger-sos`,

  SAVE_USER_LOCATION: `${BASE_URL}/save-user-location`,
  FETCH_FAMILY_LOCATIONS: `${BASE_URL}/fetch-user-location`,

  CREATE_FAMILY_GROUP: `${BASE_URL}/family-group/create`,
  FETCH_FAMILY_GROUP: `${BASE_URL}/family-group/fetch`,

  SEND_MESSAGE: `${BASE_URL}/family-group/message/send`,
  FETCH_MESSAGE: `${BASE_URL}/family-group/message/fetch`,
};

export default API;
