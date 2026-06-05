import React, { useState, useEffect } from "react";
import apiClient from "../apiClient";
import API from "../API";
import { toast } from "react-toastify";
import "./emgPage.css";

const AddEditContactModal = ({ show, onClose, contact, onSave }) => {

  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (contact) {
      setName(contact.name || "");
      setContactNumber(contact.contactNumber || "");
      setEmail(contact.email || "");
    } else {
      setName("");
      setContactNumber("");
      setEmail("");
    }
  }, [contact, show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (contact?.emgId) {
        await apiClient.put(
          `${API.UPDATE_EMERGENCY_CONTACT}/${contact.emgId}`,
          { name, contactNumber, email }
        );
        toast.success("Contact updated successfully");
      } else {
        await apiClient.post(
          API.ADD_EMERGENCY_CONTACT,
          { name, contactNumber, email }
        );
        toast.success("Contact added successfully");
      }

      onSave();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save contact");
    } finally {
      setSaving(false);
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="emg-modal-backdrop-custom" onClick={onClose} aria-hidden />
      <div
        className="modal fade show emg-form-modal d-block"
        tabIndex={-1}
        role="dialog"
        style={{ zIndex: 1070 }}
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">
                  {contact ? "Edit" : "Add"} emergency contact
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={onClose}
                  aria-label="Close"
                />
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contact name"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Phone number</label>
                  <input
                    type="tel"
                    className="form-control"
                    required
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="e.g. +91 9876543210"
                  />
                </div>

                <div className="mb-0">
                  <label className="form-label">Email (recommended for SOS)</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@email.com"
                  />
                  <small className="text-muted">
                    SOS alerts are emailed to this address
                  </small>
                </div>
              </div>

              <div className="modal-footer flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={onClose}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving…" : contact ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEditContactModal;
