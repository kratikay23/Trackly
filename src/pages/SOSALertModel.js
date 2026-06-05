import React, { useCallback, useEffect, useMemo, useState } from "react";
import apiClient from "../apiClient";
import API from "../API";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import AddEditContactModal from "./AddEditContactModal";
import { toast } from "react-toastify";
import "./emgPage.css";

const SosAlertModal = ({ onClose }) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const [showContacts, setShowContacts] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [alertMessage, setAlertMessage] = useState("SOS Alert - I need help!");
  const [sending, setSending] = useState(false);
  const { user } = useSelector((state) => state.userData);
  const [editingContact, setEditingContact] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [location, setLocation] = useState(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(false);

  const handleClose = () => {
    if (onClose) onClose();
    else navigate("/");
  };

  useEffect(() => {
    if (showContacts) return undefined;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowContacts(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showContacts]);

  const fetchContacts = useCallback(async () => {
    if (!user) return;
    setLoadingContacts(true);
    try {
      const res = await apiClient.get(API.FETCH_EMERGENCY_CONTACT_BY_ID);
      setContacts(res.data.contacts || []);
    } catch (err) {
      toast.error("Failed to load emergency contacts");
      setContacts([]);
    } finally {
      setLoadingContacts(false);
    }
  }, [user]);

  useEffect(() => {
    if (showContacts) fetchContacts();
  }, [showContacts, fetchContacts]);

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

  const allFilteredSelected =
    filteredContacts.length > 0 &&
    filteredContacts.every((c) => selected.includes(c._id));

  const toggleContact = (id, checked) => {
    setSelected((prev) =>
      checked ? [...new Set([...prev, id])] : prev.filter((x) => x !== id)
    );
  };

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      const filteredIds = new Set(filteredContacts.map((c) => c._id));
      setSelected((prev) => prev.filter((id) => !filteredIds.has(id)));
    } else {
      const ids = filteredContacts.map((c) => c._id);
      setSelected((prev) => [...new Set([...prev, ...ids])]);
    }
  };

  const skipCountdown = () => setShowContacts(true);

  const sendAlert = () => {
    if (selected.length === 0) {
      toast.error("Select at least one emergency contact");
      return;
    }

    setSending(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setShowShareOptions(true);

        try {
          await Promise.all(
            selected.map((contactId) =>
              apiClient.post(
                API.SOS_ALERT_TRIGGER,
                { latitude, longitude, alertMessage, emgId: contactId }
              )
            )
          );
          toast.success(`SOS sent to ${selected.length} contact(s)`);
        } catch (err) {
          toast.error(err.response?.data?.message || "Failed to send SOS alert");
        } finally {
          setSending(false);
        }
      },
      () => {
        toast.error("Location permission is required to send SOS");
        setSending(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const mapLink = location
    ? `https://maps.google.com/?q=${location.latitude},${location.longitude}`
    : "";

  const shareText = location
    ? `🚨 SOS from Trackly!\n${alertMessage}\nLocation: ${mapLink}`
    : alertMessage;

  return (
    <div className="sos-overlay" role="dialog" aria-modal="true" aria-labelledby="sos-title">
      <div className="sos-panel">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 id="sos-title" className="mb-0 text-danger fw-bold">
            Emergency SOS
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={handleClose}
            aria-label="Close"
          />
        </div>
        <hr className="my-2" />

        {!showContacts ? (
          <div className="text-center">
            <p className="text-muted mb-2">Alert will open in</p>
            <div className="sos-countdown-ring" aria-live="polite">
              <span>{countdown}</span>
              <small>seconds</small>
            </div>
            <p className="small text-muted mb-3">
              Stay calm. You can cancel or skip the countdown.
            </p>
            <div className="sos-actions justify-content-center">
              <button type="button" className="btn btn-outline-secondary" onClick={handleClose}>
                Cancel
              </button>
              <button type="button" className="btn btn-danger" onClick={skipCountdown}>
                Continue now
              </button>
            </div>
          </div>
        ) : (
          <>
            <h6 className="fw-semibold">Select emergency contacts</h6>
            <p className="small text-muted">
              Choose who receives your alert and live location.
            </p>

            {loadingContacts ? (
              <div className="text-center py-4">
                <div className="spinner-border spinner-border-sm text-danger" />
              </div>
            ) : contacts.length === 0 ? (
              <div className="emg-empty-state py-4">
                <p className="mb-2">No emergency contacts saved.</p>
                <button
                  type="button"
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => {
                    setEditingContact(null);
                    setShowModal(true);
                  }}
                >
                  Add contact
                </button>
                <Link to="/emg-contacts" className="btn btn-outline-primary btn-sm" onClick={handleClose}>
                  Manage contacts
                </Link>
              </div>
            ) : (
              <>
                <div className="emg-search-wrap mb-2">
                  <input
                    type="search"
                    className="form-control form-control-sm"
                    placeholder="Search contacts"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {filteredContacts.length > 0 && (
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <button
                      type="button"
                      className="btn btn-link btn-sm p-0"
                      onClick={toggleSelectAll}
                    >
                      {allFilteredSelected ? "Deselect all" : "Select all"}
                    </button>
                    <small className="text-muted">{selected.length} selected</small>
                  </div>
                )}

                <div className="mb-3" style={{ maxHeight: "220px", overflowY: "auto" }}>
                  {filteredContacts.length === 0 ? (
                    <p className="text-muted small text-center py-2">No matches</p>
                  ) : (
                    filteredContacts.map((c) => {
                      const isChecked = selected.includes(c._id);
                      return (
                        <label
                          key={c._id}
                          className={`sos-contact-item w-100 ${isChecked ? "is-selected" : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => toggleContact(c._id, e.target.checked)}
                          />
                          <div className="sos-contact-info">
                            <strong>{c.name}</strong>
                            <small>{c.contactNumber}</small>
                            {c.email && <small className="d-block">{c.email}</small>}
                          </div>
                        </label>
                      );
                    })
                  )}
                </div>

                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm w-100 mb-3"
                  onClick={() => {
                    setEditingContact(null);
                    setShowModal(true);
                  }}
                >
                  + Add emergency contact
                </button>
              </>
            )}

            <label className="form-label fw-bold small">Alert message</label>
            <textarea
              className="form-control mb-3"
              value={alertMessage}
              rows={3}
              onChange={(e) => setAlertMessage(e.target.value)}
              placeholder="Describe your emergency..."
            />

            <div className="sos-actions">
              <button
                type="button"
                className="btn btn-danger"
                onClick={sendAlert}
                disabled={sending || selected.length === 0 || contacts.length === 0}
              >
                {sending ? "Sending…" : "Send SOS alert"}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={handleClose}>
                Cancel
              </button>
            </div>

            {showShareOptions && location && (
              <div className="sos-share-box">
                <h6 className="mb-1 small fw-bold">Also share via</h6>
                <div className="sos-share-links">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-success btn-sm"
                  >
                    WhatsApp
                  </a>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      selected.forEach((id) => {
                        const contact = contacts.find((c) => c._id === id);
                        if (contact?.contactNumber) {
                          window.open(
                            `sms:${contact.contactNumber}?body=${encodeURIComponent(shareText)}`,
                            "_blank"
                          );
                        }
                      });
                    }}
                  >
                    SMS
                  </button>
                  <a
                    href={mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-dark btn-sm"
                  >
                    Open map
                  </a>
                </div>
              </div>
            )}
          </>
        )}
      </div>

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
};

export default SosAlertModal;
