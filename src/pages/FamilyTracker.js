import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../API";
import { useSelector } from "react-redux";

function FamilyTracker() {
  const { token , user} = useSelector((state) => state.userData);
  const [family, setFamily] = useState(null);
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState(""); // "join" | "create"
  const [familyName, setFamilyName] = useState("");
  const [familyNameInput, setFamilyNameInput] = useState(""); // <-- for editing
  const [selectedFamilyId, setSelectedFamilyId] = useState("");
  

  useEffect(() => {
    if (token) fetchFamily();
  }, [token]);

  const fetchFamily = async () => {
    try {
      const res = await axios.get(API.GET_FAMILY, {
        headers: { Authorization: `${token}` },
      });
      console.log(token)
      if (res.data.family) {
        setFamily(res.data.family);
        setFamilyNameInput(res.data.family.familyName); // pre-fill input
        setEnabled(true);
      }
    } catch {
      setEnabled(false);
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post(
        API.ADD_FAMILY,
        { familyName },
        { headers: { Authorization: `${token}` } }
      );
      alert("Family created successfully");
      fetchFamily();
      setMode("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoin = async () => {
    try {
      await axios.post(
        API.JOIN_BY_CODE,
        { familyCode: selectedFamilyId },
        { headers: { Authorization: `${token}` } }
      );
      alert("Joined family");
      fetchFamily();
      setMode("");
    } catch {
      alert("Invalid code or join failed");
    }
  };

  const handleSaveChange = async () => {
    try {
      const res = await axios.put(
        API.CHANGE_FAMILY_NAME,
        { newFamilyName: familyNameInput },
        { headers: { Authorization: `${token}` } }
      );
      alert("Family name updated");
      fetchFamily();
    } catch (err) {
      console.error("Failed to update name", err);
      alert("Update failed");
    }
  };

  const handleCancel = () => {
    setFamilyNameInput(family.familyName); // reset to original
  };

  return (
    <div className="card p-4 shadow-sm rounded-4" >
      <h5 className="mb-4">Family Tracker</h5>

      {enabled && family && (
        <>
          <div className="mb-3">
            <label className="form-label fw-bold">Family Name</label>
            <input
              type="text"
              className="form-control"
              value={familyNameInput}
              onChange={(e) => setFamilyNameInput(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Family Code</label>
            <input
              type="text"
              className="form-control"
              value={family.familyID}
              disabled
            />
          </div>
          <div className="mb-2">
            <label className="form-label fw-bold">Role</label>
            <input
              type="text"
              className="form-control"
              value={
                family.members.find((member) => member._id === user._id)?.role || "Member"
              }
              readOnly
            />
          </div>


          <div className="d-flex justify-content-end gap-2 mt-3">
            <button className="btn btn-outline-dark" onClick={handleCancel}>
              Cancel
            </button>
            <button className="btn btn-primary ml-2" onClick={handleSaveChange}>
              Save Change
            </button>
          </div>
        </>
      )}

      {!family && (
        <>
          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              checked={enabled}
              onChange={() => setEnabled(!enabled)}
            />
            <label className="form-check-label">Enable Family Tracker</label>
          </div>

          {enabled && (
            <>
              {!mode && (
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-primary w-50"
                    onClick={() => setMode("create")}
                  >
                    Create Family
                  </button>
                  <button
                    className="btn btn-outline-secondary w-50"
                    onClick={() => setMode("join")}
                  >
                    Join Family
                  </button>
                </div>
              )}

              {mode === "create" && (
                <div className="mt-3">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Enter family name"
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                  />
                  <div className="d-flex gap-2">
                    <button className="btn btn-success w-50" onClick={handleCreate}>
                      Create
                    </button>
                    <button
                      className="btn btn-outline-danger w-50"
                      onClick={() => setMode("")}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {mode === "join" && (
                <div className="mt-3">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Enter Family Code"
                    value={selectedFamilyId}
                    onChange={(e) => setSelectedFamilyId(e.target.value)}
                  />
                  <div className="d-flex gap-2">
                    <button className="btn btn-primary w-50" onClick={handleJoin}>
                      Join
                    </button>
                    <button
                      className="btn btn-outline-danger w-50"
                      onClick={() => setMode("")}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default FamilyTracker;
