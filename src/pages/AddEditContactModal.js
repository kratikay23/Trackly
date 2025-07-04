import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../API";
import { useSelector } from "react-redux";

const AddEditContactModal = ({ show, onClose, contact, onSave }) => {
  const { token } = useSelector((state) => state.userData);

  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (contact) {
      setName(contact.name);
      setContactNumber(contact.contactNumber);
      setEmail(contact.email);
    } else {
      setName("");
      setContactNumber("");
      setEmail("");
    }
  }, [contact]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (contact) {
        // EDIT
        await axios.put(`${API.UPDATE_EMERGENCY_CONTACT}/${contact.emgId}`, {
          name,
          contactNumber,
          email,
        }, {
          headers: { Authorization: token },
        });
        alert("Contact updated successfully");
      } else {
        // ADD
        const res = await axios.post(API.ADD_EMERGENCY_CONTACT, {
          name,
          contactNumber,
          email,
        }, {
          headers: { Authorization: token },
        });
        console.log(res.data)
        alert("Contact added successfully");
      }

      onSave();      // Refresh list
      onClose();     // Close modal

    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save contact");
    }
  };

  return (
    <div className={`modal fade show`} style={{ display: show ? 'block' : 'none' ,marginTop : "50px"}} tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">

          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{contact ? "Edit" : "Add"} Emergency Contact</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input type="text" className="form-control" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input type="text" className="form-control" required value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
              </div>

              <div className="mb-3">
                <label className="form-label">Email (optional)</label>
                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">{contact ? "Update" : "Add"}</button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default AddEditContactModal;
