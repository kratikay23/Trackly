import { useEffect, useMemo, useRef, useState } from "react";
import apiClient from "../apiClient";
import API from "../API";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./familySideBar.css";

const dedupeMembers = (members) => {
  const seen = new Set();
  return (members || []).filter((m) => {
    const id = String(m._id);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
};

const FamilySidebar = () => {
  const { user } = useSelector((state) => state.userData);
  const userId = user?._id;
  const [members, setMembers] = useState([]);
  const [familyName, setFamilyName] = useState("");
  const [familyCode, setFamilyCode] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectingHead, setSelectingHead] = useState(false);
  const [selectingRemove, setSelectingRemove] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const filteredMembers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return members;

    return members.filter((member) => {
      const name = (member.userName || "").toLowerCase();
      const email = (member.email || "").toLowerCase();
      const role = (member.role || "").toLowerCase();
      return name.includes(query) || email.includes(query) || role.includes(query);
    });
  }, [members, searchQuery]);

  useEffect(() => {
    const fetchFamily = async () => {
      try {
        const res = await apiClient.get(API.GET_FAMILY);

        const family = res.data.family;
        setFamilyName(family.familyName || "Family");
        setFamilyCode(family.familyID || family.familyId || "N/A");
        setMembers(dedupeMembers(family.members));
      } catch (error) {
      }
    };

    if (userId) fetchFamily();
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuAction = (action) => {
    setMenuOpen(false);
    if (action === "transfer-head") {
      setSelectingHead(true);
    } else if (action === "remove-member") {
      setSelectingRemove(true);
    } else if (action === "add-member") {
      setShowAddInput(true);
    } else if (action === "leave-group") {
      handleLeaveFamily();
    } else if (action === "delete-group") {
      handleDeleteFamily();
    } else if (action === "live-map" || action === "family-group") {
      navigate(`/family-tracker/${action}`);
    }
  };

  const handleTransferRole = async (newHeadUserId) => {
    try {
      await apiClient.post(
        API.TRANSFER_HEAD,
        { newHeadUserId }
      );
      toast.success("Head role transferred");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to transfer head role");
    }
  };

  const handleRemove = async (memberId) => {
    try {
      await apiClient.post(
        API.REMOVE_MEMBER,
        { memberId }
      );
      setMembers((prev) => prev.filter((m) => String(m._id) !== String(memberId)));
      toast.success("Member removed");
    } catch (error) {
      toast.error("Failed to remove member");
    }
  };

  const handleAddMember = async () => {
    if (!newMemberEmail) return toast.error("Please enter an email");
    try {
      await apiClient.post(
        API.ADD_MEMBER,
        { memberEmail: newMemberEmail }
      );
      toast.success("Member added");
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add member");
    }
  };

  const handleLeaveFamily = async () => {
    if (!window.confirm("Are you sure you want to leave the family?")) return;
    try {
      await apiClient.post(API.LEAVE_FAMILY, {});
      toast.success("You left the family");
      navigate("/profile");
    } catch (error) {
      toast.error("Failed to leave family");
    }
  };

  const handleDeleteFamily = async () => {
    if (!window.confirm("Are you sure you want to delete the family? This cannot be undone.")) return;
    try {
      await apiClient.delete(API.DELETE_FAMILY);
      toast.success("Family deleted successfully");
      navigate("/profile");
    } catch (error) {
      toast.error("Failed to delete family");
    }
  };

  const currentUserId = String(user?._id || "");

  return (
    <div className="family-sidebar-root">
      <header className="family-sidebar-header">
        <button
          type="button"
          className="family-sidebar-back"
          onClick={() => navigate("/")}
          aria-label="Back to home"
        >
          ←
        </button>
        <div className="family-sidebar-title">
          <h6>{familyName}</h6>
          <small>{familyCode}</small>
        </div>
        <div ref={menuRef} className="position-relative">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary family-sidebar-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Family menu"
          >
            ⋮
          </button>
          {menuOpen && (
            <div className="family-sidebar-menu">
              <button type="button" className="dropdown-item" onClick={() => handleMenuAction("live-map")}>
                Live Map
              </button>
              <button type="button" className="dropdown-item" onClick={() => handleMenuAction("family-group")}>
                Group Chat
              </button>
              <button type="button" className="dropdown-item" onClick={() => handleMenuAction("leave-group")}>
                Leave Group
              </button>
              {user?.role === "Head" && (
                <>
                  <button type="button" className="dropdown-item" onClick={() => handleMenuAction("add-member")}>
                    Add Member
                  </button>
                  <button type="button" className="dropdown-item" onClick={() => handleMenuAction("remove-member")}>
                    Remove Member
                  </button>
                  <button type="button" className="dropdown-item" onClick={() => handleMenuAction("transfer-head")}>
                    Transfer Head Role
                  </button>
                  <button type="button" className="dropdown-item text-danger" onClick={() => handleMenuAction("delete-group")}>
                    Delete Family
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="family-sidebar-search">
        <input
          type="search"
          placeholder="Search by name, email, or role"
          className="form-control"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search family members"
        />
      </div>

      <div className="family-sidebar-members">
        {filteredMembers.length === 0 && (
          <p className="text-muted text-center small py-3 mb-0">
            {searchQuery.trim()
              ? `No members match "${searchQuery.trim()}"`
              : "No members in this family yet"}
          </p>
        )}
        {filteredMembers.map((member) => {
          const memberId = String(member._id);
          const isYou = memberId === currentUserId;
          const isSelected = selectedMemberId === memberId;
          const isClickable = !isYou && (selectingHead || selectingRemove);

          return (
            <div
              key={memberId}
              className={`family-member-card ${isSelected ? "is-selected" : ""} ${isClickable ? "is-clickable" : ""}`}
              onClick={() => {
                if (isClickable) setSelectedMemberId(memberId);
              }}
              onKeyDown={(e) => {
                if (isClickable && (e.key === "Enter" || e.key === " ")) {
                  setSelectedMemberId(memberId);
                }
              }}
              role={isClickable ? "button" : undefined}
              tabIndex={isClickable ? 0 : undefined}
            >
              <div>
                <div className="family-member-name">
                  {member.userName}
                  {isYou && " (You)"}
                </div>
                <small className="text-muted">{member.role}</small>
              </div>
              {isClickable && (
                <input
                  type="radio"
                  name="member-action"
                  checked={isSelected}
                  onChange={() => setSelectedMemberId(memberId)}
                  aria-label={`Select ${member.userName}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {(selectingHead || selectingRemove) && (
        <div className="family-sidebar-actions">
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={() => {
              setSelectingHead(false);
              setSelectingRemove(false);
              setSelectedMemberId(null);
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={() => {
              if (!selectedMemberId) return toast.error("Please select a member");
              if (selectingHead) handleTransferRole(selectedMemberId);
              if (selectingRemove) handleRemove(selectedMemberId);
              setSelectingHead(false);
              setSelectingRemove(false);
              setSelectedMemberId(null);
            }}
          >
            Confirm
          </button>
        </div>
      )}

      {showAddInput && (
        <div className="family-sidebar-actions flex-column">
          <input
            type="email"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            placeholder="Enter email to add"
            className="form-control w-100"
          />
          <div className="d-flex gap-2 w-100">
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => {
                setShowAddInput(false);
                setNewMemberEmail("");
              }}
            >
              Cancel
            </button>
            <button type="button" className="btn btn-success" onClick={handleAddMember}>
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilySidebar;
