const BASE_URL = "https://trackly-backend-git1.onrender.com"
export default {
  SIGN_IN: `${BASE_URL}/user/sign-in`,
  SIGN_UP: `${BASE_URL}/user/sign-up`,
  GET_USER_BY_ID: `${BASE_URL}/user`,
  GOOGLE_SIGN_IN : `${BASE_URL}/user/google-sign-in`,
  UPDATE_PASSWORD : `${BASE_URL}/user/update-password`,
  FORGET_PASSWORD : `${BASE_URL}/user/forget-password`,
  RESET_PASSWORD : `${BASE_URL}/user/reset-password`,

  //Familly Routes 
  ADD_FAMILY : `${BASE_URL}/family/add`,
  GET_FAMILY : `${BASE_URL}/family/fetch`,
  ADD_MEMBER : `${BASE_URL}/family/add-member`,
  REMOVE_MEMBER : `${BASE_URL}/family/remove-member`,
  LEAVE_FAMILY : `${BASE_URL}/family/leave-family`,
  CHANGE_FAMILY_NAME : `${BASE_URL}/family/change-name`,
  JOIN_BY_CODE : `${BASE_URL}/family/join-bycode`,
  TRANSFER_HEAD : `${BASE_URL}/family/transfer-head`,
  DELETE_FAMILY : `${BASE_URL}/family/delete`,

  //Emergency Contact 
  ADD_EMERGENCY_CONTACT : `${BASE_URL}/emergency-contact/add`,
  UPDATE_EMERGENCY_CONTACT : `${BASE_URL}/emergency-contact/update`,
  FETCH_EMERGENCY_CONTACT_BY_ID : `${BASE_URL}/emergency-contact`,
  FETCH_ALL_EMERGENCY_CONTACT : `${BASE_URL}/emergency-contact`,
  DELETE_EMERGENCY_CONTACT : `${BASE_URL}/emergency-contact/delete`,

  //SOS- alert Route
  SOS_ALERT_TRIGGER : `${BASE_URL}/trigger-sos`,

  //User Location Route 
  SAVE_USER_LOCATION : `${BASE_URL}/save-user-location`,
  FETCH_FAMILY_LOCATIONS : `${BASE_URL}/fetch-user-location`,

  //Family Group Route
  CREATE_FAMILY_GROUP : `${BASE_URL}/family-group/create`,
  FETCH_FAMILY_GROUP : `${BASE_URL}/family-group/fetch`,

  //Message Route
  SEND_MESSAGE : `${BASE_URL}/family-group/message/send`,
  FETCH_MESSAGE : `${BASE_URL}/family-group/message/fetch`,
  DELETE_MESSAGE  : `${BASE_URL}/family-group/message/delete`

};


