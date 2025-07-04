import { useEffect, useRef, useState } from "react";
import axios from "axios";
import API from "../API";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const FamilySidebar = () => {
  const { token, user } = useSelector((state) => state.userData);
  const [members, setMembers] = useState([]);
  const [familyName, setFamilyName] = useState("");
  const [familyCode, setFamilyCode] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectingHead, setSelectingHead] = useState(false);
  const [selectingRemove, setSelectingRemove] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFamily = async () => {
      try {
        const res = await axios.get(API.GET_FAMILY, {
          headers: { Authorization: token },
        });

        const family = res.data.family;
        setFamilyName(family.familyName || "Family");
        setFamilyCode(family.familyID || "N/A");
        setMembers(family.members || []);
      } catch (error) {
        console.error("Failed to fetch family members:", error);
      }
    };

    fetchFamily();
  }, [token]);

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
    } else {
      navigate(action);
    }
  };

  const handleTransferRole = async (newHeadUserId) => {
    try {
      await axios.post(
        API.TRANSFER_HEAD,
        { newHeadUserId },
        { headers: { Authorization: token } }
      );
      window.location.reload();
    } catch (error) {
      alert("Failed to transfer head role");
      console.log(error);
    }
  };

  const handleRemove = async (memberId) => {
    try {
      await axios.post(
        API.REMOVE_MEMBER,
        { memberId },
        { headers: { Authorization: token } }
      );
      setMembers((prev) => prev.filter((m) => m._id !== memberId));
    } catch (error) {
      alert("Failed to remove member");
      console.log(error);
    }
  };

  const handleAddMember = async () => {
    if (!newMemberEmail) return alert("Please enter an email");
    try {
      await axios.post(
        API.ADD_MEMBER,
        { memberEmail: newMemberEmail },
        { headers: { Authorization: token } }
      );
      alert("Member added");
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add member");
    }
  };

  const handleLeaveFamily = async () => {
    if (!window.confirm("Are you sure you want to leave the family?")) return;
    try {
      await axios.post(
        API.LEAVE_FAMILY,
        {},
        { headers: { Authorization: token } }
      );
      alert("You left the family");
      window.location.reload();
    } catch (error) {
      alert("Failed to leave family");
    }
  };

  const handleDeleteFamily = async () => {
    if (!window.confirm("Are you sure you want to delete the family? This cannot be undone.")) return;
    try {
      await axios.delete(API.DELETE_FAMILY, {
        headers: { Authorization: token },
      });
      alert("Family deleted successfully");
      window.location.reload();
    } catch (error) {
      alert("Failed to delete family");
      console.log(error);
    }
  };

  return (
    <div
      style={{
        width: "340px",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #ddd",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <p className="text-start mb-3">
          <span role="button" onClick={() => navigate("/")} className="text-primary">
            ←
          </span>
        </p>
        <div>
          <h6 className="mb-0 fw-bold">{familyName}</h6>
          <small className="text-muted">{familyCode}</small>
        </div>
        <div ref={menuRef} style={{ position: "relative" }}>
          <button className="btn btn-sm" onClick={() => setMenuOpen(!menuOpen)}>
            ⋮
          </button>
          {menuOpen && (
            <div
              className="position-absolute bg-white border rounded p-2 shadow"
              style={{ top: "30px", right: 0, zIndex: 1000 }}
            >
              <button className="dropdown-item" onClick={() => handleMenuAction("family-group")}>
                Group Chat
              </button>
              <button className="dropdown-item" onClick={() => handleMenuAction("live-map")}>
                Live Map
              </button>
              <button className="dropdown-item" onClick={() => handleMenuAction("leave-group")}>
                Leave Group
              </button>
              {user.role === "Head" && (
                <>
                  <button className="dropdown-item" onClick={() => handleMenuAction("add-member")}>
                    Add Member
                  </button>
                  <button className="dropdown-item" onClick={() => handleMenuAction("remove-member")}>
                    Remove Member
                  </button>
                  <button className="dropdown-item" onClick={() => handleMenuAction("transfer-head")}>
                    Transfer Head Role
                  </button>
                  <button className="dropdown-item text-danger" onClick={() => handleMenuAction("delete-group")}>
                    Delete Family
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="px-3 py-2">
        <input type="text" placeholder="Search" className="form-control" disabled />
      </div>

      <div style={{ overflowY: "auto", flex: 1 }}>
        {members.map((member) => {
          const isYou = member._id === user._id;
          const isSelected = selectedMemberId === member._id;

          return (
            <div
              key={member._id}
              className={`d-flex justify-content-between align-items-center border rounded mb-2 p-2 ${isSelected ? "bg-info" : "bg-light"}`}
              style={{ cursor: (selectingHead || selectingRemove) ? "pointer" : "default" }}
              onClick={() => {
                if (!isYou && (selectingHead || selectingRemove)) {
                  setSelectedMemberId(member._id);
                }
              }}
            >
              <div>
                <strong>{member.userName} {isYou && "(You)"}</strong><br />
                <small className="text-muted">{member.role}</small>
              </div>
              {!isYou && (selectingHead || selectingRemove) && (
                <input
                  type="radio"
                  checked={isSelected}
                  onChange={() => setSelectedMemberId(member._id)}
                />
              )}
            </div>
          );
        })}
      </div>

      {(selectingHead || selectingRemove) && (
        <div className="p-3 border-top d-flex justify-content-between align-items-center bg-white shadow-sm">
          <button
            className="btn btn-outline-danger"
            onClick={() => {
              setSelectingHead(false);
              setSelectingRemove(false);
              setSelectedMemberId(null);
            }}
          >
            ❌ Cancel
          </button>
          <button
            className="btn btn-success"
            onClick={() => {
              if (!selectedMemberId) return alert("Please select a member");
              if (selectingHead) handleTransferRole(selectedMemberId);
              if (selectingRemove) handleRemove(selectedMemberId);
              setSelectingHead(false);
              setSelectingRemove(false);
              setSelectedMemberId(null);
            }}
          >
            ✅ OK
          </button>
        </div>
      )}

      {showAddInput && (
        <div className="p-3 border-top bg-white">
          <input
            type="email"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            placeholder="Enter email to add"
            className="form-control mb-2"
          />
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-outline-danger"
              onClick={() => {
                setShowAddInput(false);
                setNewMemberEmail("");
              }}
            >
              ❌ Cancel
            </button>
            <button className="btn btn-success" onClick={handleAddMember}>
              ✅ Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilySidebar;





// const { token, user } = useSelector((state) => state.userData);
//   const [members, setMembers] = useState([]);
//   const [familyName, setFamilyName] = useState("");
//   const [familyCode, setFamilyCode] = useState("");
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [selectingHead, setSelectingHead] = useState(false);
//   const [selectingRemove, setSelectingRemove] = useState(false);
//   const [selectedMemberId, setSelectedMemberId] = useState(null);
//   const [showAddInput, setShowAddInput] = useState(false);
//   const [newMemberEmail, setNewMemberEmail] = useState("");
//   const menuRef = useRef(null);
//   const navigate = useNavigate();

//   const fetchFamily = async () => {
//     try {
//       const res = await axios.get(API.GET_FAMILY, {
//         headers: { Authorization: token },
//       });

//       const family = res.data.family;
//       setFamilyName(family.familyName || "Family");
//       setFamilyCode(family.familyID || "N/A");
//       setMembers(family.members || []);
//     } catch (error) {
//       console.error("Failed to fetch family members:", error);
//     }
//   };

//   useEffect(() => {
//     fetchFamily();
//   }, [token]);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (menuRef.current && !menuRef.current.contains(e.target)) {
//         setMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleMenuAction = (action) => {
//     setMenuOpen(false);
//     if (action === "transfer-head") {
//       setSelectingHead(true);
//     } else if (action === "remove-member") {
//       setSelectingRemove(true);
//     } else if (action === "add-member") {
//       setShowAddInput(true);
//     } else if (action === "leave-group") {
//       handleLeaveFamily();
//     } else if (action === "delete-group") {
//       handleDeleteFamily();
//     } else {
//       navigate(action);
//     }
//   };

//   const handleTransferRole = async (newHeadUserId) => {
//     try {
//       await axios.post(
//         API.TRANSFER_HEAD,
//         { newHeadUserId },
//         { headers: { Authorization: token } }
//       );
//       alert("Head role transferred");
//       fetchFamily(); // ✅ no reload
//     } catch (error) {
//       alert("Failed to transfer head role");
//       console.log(error);
//     }
//   };

//   const handleRemove = async (memberId) => {
//     try {
//       await axios.post(
//         API.REMOVE_MEMBER,
//         { memberId },
//         { headers: { Authorization: token } }
//       );
//       alert("Member removed");
//       fetchFamily(); // ✅ no reload
//     } catch (error) {
//       alert("Failed to remove member");
//       console.log(error);
//     }
//   };

//   const handleAddMember = async () => {
//     if (!newMemberEmail) return alert("Please enter an email");
//     try {
//       await axios.post(
//         API.ADD_MEMBER,
//         { memberEmail: newMemberEmail },
//         { headers: { Authorization: token } }
//       );
//       alert("Member added");
//       setNewMemberEmail("");
//       setShowAddInput(false);
//       fetchFamily(); // ✅ no reload
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to add member");
//     }
//   };

//   const handleLeaveFamily = async () => {
//     if (!window.confirm("Are you sure you want to leave the family?")) return;
//     try {
//       await axios.post(
//         API.LEAVE_FAMILY,
//         {},
//         { headers: { Authorization: token } }
//       );
//       alert("You left the family");
//       navigate("/"); // go to home instead of reloading
//     } catch (error) {
//       alert("Failed to leave family");
//     }
//   };

//   const handleDeleteFamily = async () => {
//     if (!window.confirm("Are you sure you want to delete the family? This cannot be undone.")) return;
//     try {
//       await axios.delete(API.DELETE_FAMILY, {
//         headers: { Authorization: token },
//       });
//       alert("Family deleted successfully");
//       navigate("/"); // ✅ back to home
//     } catch (error) {
//       alert("Failed to delete family");
//       console.log(error);
//     }
//   };