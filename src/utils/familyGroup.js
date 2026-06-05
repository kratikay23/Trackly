import apiClient from "../apiClient";
import API from "../API";

export async function getFamilyFromApi() {
  const res = await apiClient.get(API.GET_FAMILY);
  return res.data.family || null;
}

export async function getFamilyGroupByCode(familyCode) {
  const res = await apiClient.get(`${API.FETCH_FAMILY_GROUP}/${familyCode}`);
  return res.data.result || null;
}

export async function getFamilyGroupId() {
  const family = await getFamilyFromApi();
  if (!family?.familyID) return null;
  const group = await getFamilyGroupByCode(family.familyID);
  return group?._id || null;
}
