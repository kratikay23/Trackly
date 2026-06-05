import React, { useState, useEffect, useCallback } from "react";
import apiClient from "../apiClient";
import API from "../API";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../components/react-redux/UserSlice";
import { toast } from "react-toastify";

function FamilyTracker() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userData);
  const [family, setFamily] = useState(null);
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [familyNameInput, setFamilyNameInput] = useState("");
  const [selectedFamilyId, setSelectedFamilyId] = useState("");
  const [saving, setSaving] = useState(false);

  const userId = user?._id;

  const fetchFamily = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await apiClient.get(API.GET_FAMILY);
      if (res.data.family) {
        setFamily(res.data.family);
        setFamilyNameInput(res.data.family.familyName);
        setEnabled(true);
        dispatch(
          updateUser({
            familyId: res.data.family._id,
            role: res.data.role,
          })
        );
      } else {
        setFamily(null);
        setEnabled(false);
      }
    } catch {
      setFamily(null);
      setEnabled(false);
    }
  }, [userId, dispatch]);

  useEffect(() => {
    fetchFamily();
  }, [fetchFamily]);

  const handleCreate = async () => {
    if (!familyName.trim()) {
      toast.error("Enter a family name");
      return;
    }
    try {
      if (user?.authProvider === "google"&& user.contactNo === "") {
        toast.error("Link email login from Profile to create a family");
        return;
      }
      await apiClient.post(
        API.ADD_FAMILY,
        { familyName: familyName.trim() }
      );
      toast.success("Family created successfully");
      setFamilyName("");
      setMode("");
      fetchFamily();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create family");
    }
  };

  const handleJoin = async () => {
    if (!selectedFamilyId.trim()) {
      toast.error("Enter a family code");
      return;
    }
    try {
      await apiClient.post(
        API.JOIN_BY_CODE,
        { familyCode: selectedFamilyId.trim() }
      );
      toast.success("Joined family");
      setSelectedFamilyId("");
      setMode("");
      fetchFamily();
    } catch {
      toast.error("Invalid code or join failed");
    }
  };

  const handleSaveChange = async () => {
    if (!familyNameInput.trim()) {
      toast.error("Family name cannot be empty");
      return;
    }
    try {
      setSaving(true);
      await apiClient.put(
        API.CHANGE_FAMILY_NAME,
        { newFamilyName: familyNameInput.trim() }
      );
      toast.success("Family name updated");
      fetchFamily();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (family) setFamilyNameInput(family.familyName);
  };

  const myRole =
    family?.members?.find((m) => String(m._id) === String(user?._id))?.role ||
    "Member";

  return (
    <div className="card family-tracker-card shadow-sm border-0">
      <h5 className="mb-4">Family Tracker</h5>

      {family && (
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
              value={family.familyID || family.familyId || ""}
              disabled
              readOnly
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Role</label>
            <input type="text" className="form-control" value={myRole} readOnly />
          </div>
          <div className="family-tracker-actions mt-3">
            <button
              type="button"
              className="btn btn-outline-dark w-100 w-sm-auto"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary w-100 w-sm-auto"
              onClick={handleSaveChange}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save Change"}
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
              id="enable-family"
              checked={enabled}
              onChange={() => setEnabled(!enabled)}
            />
            <label className="form-check-label" htmlFor="enable-family">
              Enable Family Tracker
            </label>
          </div>

          {enabled && (
            <>
              {!mode && (
                <div className="d-flex flex-column flex-sm-row gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-primary w-100 w-sm-50"
                    onClick={() => setMode("create")}
                  >
                    Create Family
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary w-100 w-sm-50"
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
                  <div className="d-flex flex-column flex-sm-row gap-2">
                    <button
                      type="button"
                      className="btn btn-success w-100 w-sm-50"
                      onClick={handleCreate}
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger w-100 w-sm-50"
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
                    placeholder="Enter family code"
                    value={selectedFamilyId}
                    onChange={(e) => setSelectedFamilyId(e.target.value)}
                  />
                  <div className="d-flex flex-column flex-sm-row gap-2">
                    <button
                      type="button"
                      className="btn btn-primary w-100 w-sm-50"
                      onClick={handleJoin}
                    >
                      Join
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger w-100 w-sm-50"
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
