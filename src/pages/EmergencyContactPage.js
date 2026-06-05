import React, { useCallback, useEffect, useMemo, useState } from "react";
import apiClient from "../apiClient";
import "./emgPage.css";
import API from "../API";
import { useSelector } from "react-redux";
import AddEditContactModal from "./AddEditContactModal";
import Navbar from "../components/navBar";
import Footer from "../components/footer";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function EmergencyContactsPage() {
  const { user } = useSelector((state) => state.userData);
  const [contacts, setContacts] = useState([]);
  const [editingContact, setEditingContact] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchContacts = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await apiClient.get(API.FETCH_EMERGENCY_CONTACT_BY_ID);
      setContacts(res.data.contacts || []);
    } catch (err) {
      toast.error("Failed to load emergency contacts");
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const filteredContacts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter(
      (c) =>
        (c.name || "").toLowerCase().includes(q) ||
        (c.contactNumber || "").toLowerCase().includes(q) ||
        (c.email || "").toLowerCase().includes(q)
    );
  }, [contacts, searchQuery]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;
    try {
      await apiClient.delete(`${API.DELETE_EMERGENCY_CONTACT}/${id}`);
      toast.success("Contact deleted");
      fetchContacts();
    } catch (err) {
      toast.error("Failed to delete contact");
    }
  };

  const openAdd = () => {
    setEditingContact(null);
    setShowModal(true);
  };

  const openEdit = (c) => {
    setEditingContact({ ...c, emgId: c._id });
    setShowModal(true);
  };

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return (
    <div className="trackly-page trackly-page--app emg-page-wrapper">
      <Navbar />
      <div className="trackly-page-content emg-page-content">
        <div className="emg-page-header">
          <div>
            <h4>Emergency Contacts</h4>
            <p className="text-muted small mb-0">
              People notified when you trigger an SOS alert
            </p>
          </div>
          <button type="button" className="btn btn-primary" onClick={openAdd}>
            + Add Contact
          </button>
        </div>

        {contacts.length > 0 && (
          <div className="emg-search-wrap">
            <input
              type="search"
              className="form-control"
              placeholder="Search by name, phone, or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search emergency contacts"
            />
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) : contacts.length === 0 ? (
          <div className="emg-empty-state">
            <div className="icon">📞</div>
            <h5>No emergency contacts yet</h5>
            <p className="text-muted mb-3">
              Add at least one contact so SOS alerts can reach them.
            </p>
            <button type="button" className="btn btn-primary" onClick={openAdd}>
              Add your first contact
            </button>
          </div>
        ) : filteredContacts.length === 0 ? (
          <p className="text-muted text-center py-4">
            No contacts match &quot;{searchQuery.trim()}&quot;
          </p>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="emg-contacts-mobile">
              {filteredContacts.map((c) => (
                <article key={c._id} className="emg-contact-card">
                  <div className="emg-contact-card-header">
                    <h5 className="emg-contact-card-name">{c.name}</h5>
                  </div>
                  <p className="emg-contact-meta mb-1">
                    <span className="text-muted">Phone:</span> {c.contactNumber}
                  </p>
                  {c.email && (
                    <p className="emg-contact-meta mb-0">
                      <span className="text-muted">Email:</span> {c.email}
                    </p>
                  )}
                  <div className="emg-contact-actions">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => openEdit(c)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(c._id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* Desktop table */}
            <div className="emg-contacts-table-wrap table-responsive">
              <table className="table table-bordered bg-white rounded overflow-hidden">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th style={{ width: "160px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((c) => (
                    <tr key={c._id}>
                      <td>{c.name}</td>
                      <td>{c.contactNumber}</td>
                      <td>{c.email || "—"}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => openEdit(c)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(c._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <p className="emg-back-link text-center mt-3 mb-0">
          <Link to="/" className="text-primary text-decoration-none">
            ← Back to Dashboard
          </Link>
        </p>
      </div>
      <Footer />

      {showModal && (
        <AddEditContactModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSave={fetchContacts}
          contact={editingContact}
        />
      )}
    </div>
  );
}

export default EmergencyContactsPage;
