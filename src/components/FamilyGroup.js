import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";
import { useSelector } from "react-redux";
import GroupChatBox from "./GroupChatBox";

const FamilyGroupChat = () => {
  const { token, user } = useSelector((state) => state.userData);
  const [hasGroup, setHasGroup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    const checkFamilyGroup = async () => {
      try {
        const res = await axios.get(API.GET_FAMILY, {
          headers: { Authorization: token },
        });

        if (res.data.family && res.data.family._id) {
          const groupRes = await axios.get(
            `${API.FETCH_FAMILY_GROUP}/${res.data.family.familyID}`,
            { headers: { Authorization: token } }
          );


          const groupExists = !!groupRes.data.result;
          setHasGroup(groupExists);
        }
      } catch (error) {
        console.error("Error checking group:", error);
      } finally {
        setLoading(false);
      }
    };

    checkFamilyGroup();
  }, [token]);

  const handleCreateGroup = async () => {
    try {
      const res = await axios.get(API.GET_FAMILY, {
        headers: { Authorization: token },
      });

      const familyID = res.data.family.familyID;

      const groupRes = await axios.post(
        API.CREATE_FAMILY_GROUP,
        {
          familyID,
          groupName: groupName || "My Family Group",
        },
        { headers: { Authorization: token } }
      );

      console.log("Group created successfully:", groupRes.data);
      setHasGroup(true);
    } catch (error) {
      console.error("Failed to create family group:", error.response?.data || error);
      alert("Error creating group: " + (error.response?.data?.error || error.message));
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {hasGroup ? (
        <GroupChatBox />
      ) : (
        <div className="card p-4 shadow" style={{ width: "400px", margin: "auto", marginTop: "100px" }}>
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
