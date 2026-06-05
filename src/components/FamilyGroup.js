import React, { useEffect, useState } from "react";
import apiClient from "../apiClient";
import API from "../API";
import { getFamilyFromApi, getFamilyGroupByCode } from "../utils/familyGroup";
import { useSelector } from "react-redux";
import GroupChatBox from "./GroupChatBox";
import { toast } from "react-toastify";

const FamilyGroupChat = () => {
  const { user } = useSelector((state) => state.userData);
  const userId = user?._id;
  const [hasGroup, setHasGroup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    const checkFamilyGroup = async () => {
      try {
        const family = await getFamilyFromApi();
        if (family?._id) {
          const group = await getFamilyGroupByCode(family.familyID);
          setHasGroup(!!group);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    if (userId) checkFamilyGroup();
  }, [userId]);

  const handleCreateGroup = async () => {
    try {
      const family = await getFamilyFromApi();
      const familyID = family.familyID;

      await apiClient.post(API.CREATE_FAMILY_GROUP, {
        familyID,
        groupName: groupName || "My Family Group",
      });

      toast.success("Family group created");
      setHasGroup(true);
    } catch (error) {
      const message =
        error.response?.data?.message || error.response?.data?.error || error.message;

      // Group may already exist from a previous partial create
      if (message?.toLowerCase().includes("already exists")) {
        setHasGroup(true);
        return;
      }

      toast.error("Error creating group: " + message);
    }
  };

  if (loading) {
    return (
      <div className="family-group-page d-flex justify-content-center align-items-center">
        <div className="spinner-border text-success" role="status" />
      </div>
    );
  }

  return (
    <div className="family-group-page">
      {hasGroup ? (
        <GroupChatBox />
      ) : (
        <div className="card p-4 shadow mx-auto my-auto" style={{ maxWidth: "400px", width: "calc(100% - 24px)" }}>
          <h4 className="mb-3 text-center">Create Family Group</h4>
          <input
            type="text"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="form-control mb-3"
          />
          <button className="btn btn-primary w-100" onClick={handleCreateGroup}>
            Create Group
          </button>
        </div>
      )}
    </div>
  );
};

export default FamilyGroupChat;
