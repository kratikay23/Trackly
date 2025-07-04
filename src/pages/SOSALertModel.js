import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../API";
import { useSelector } from "react-redux";
import AddEditContactModal from "./AddEditContactModal";

const SosAlertModal = ({ onClose }) => {
  const [countdown, setCountdown] = useState(5);
  const [showContacts, setShowContacts] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [alertMessage, setAlertMessage] = useState("SOS Alert - I need help!");
  const { token, user } = useSelector((state) => state.userData);
  const [editingContact, setEditingContact] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [location, setLocation] = useState(null);
  const [showShareOptions, setShowShareOptions] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowContacts(true);
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (showContacts) {
      fetchContacts();
    }
  }, [showContacts]);

  const fetchContacts = async () => {
    try {
      const res = await axios.get(API.FETCH_EMERGENCY_CONTACT_BY_ID, {
        headers: { Authorization: token },
      });
      console.log(res.data)
      setContacts(res.data.contacts || []);
    } catch (err) {
      console.error("Error fetching contacts", err);
    }
  };

  const sendAlert = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude }); // store location
        setShowShareOptions(true);            // show links section

        for (const contactId of selected) {
          await axios.post(
            API.SOS_ALERT_TRIGGER,
            { latitude, longitude, alertMessage, emgId: contactId },
            { headers: { Authorization: token } }
          );
        }

        alert("SOS alert sent successfully!");
      },
      (error) => {
        alert("Location permission denied");
      }
    );
  };


  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5>Emergency SOS Alert</h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>
        <hr></hr>
        {!showContacts ? (
          <>
            <p className="text-muted">Sending SOS in {countdown} seconds...</p>
            <button className="btn btn-outline-danger" onClick={onClose}>Cancel</button>
          </>
        ) : (
          <>
            <h6>Select Emergency Contacts</h6>
            <ul className="list-group mb-3">
              {contacts.length === 0 ? (
                <div>
                  <p className="mb-2">You don’t have any saved emergency contacts.</p>


                </div>


              ) : (
                contacts.map((c) => (
                  <ul className="list-group">
                    <li key={c._id} className="list-group-item">
                      <input
                        type="checkbox"
                        className="form-check-input me-2"
                        onChange={(e) => {
                          if (e.target.checked) setSelected([...selected, c._id]);
                          else setSelected(selected.filter((id) => id !== c._id));
                        }}
                      />
                      {c.name} - {c.contactNumber}

                    </li>

                  </ul>

                ))
              )}
              <button
                className="btn btn-primary mt-2"
                onClick={() => {
                  setEditingContact(null);
                  setShowModal(true);
                }}>
                ➕ Add Emergency Contact
              </button>
            </ul>


            <label className="form-label fw-bold">Custom Alert Message</label>
            <textarea
              className="form-control mb-3"
              value={alertMessage}
              rows={3}
              onChange={(e) => setAlertMessage(e.target.value)}
            />

            <button className="btn btn-danger me-2" onClick={sendAlert}>🚨 Send SOS Alert</button>
            {showShareOptions && location && (
              <div className="mt-4">
                <h6>📤 Also Share Alert via:</h6>

                <div className="d-flex flex-wrap gap-3">
                  <a
                    href={
                      "https://wa.me/?text=" +
                      encodeURIComponent(
                        `🚨 SOS from Trackly!\n${alertMessage}\nLocation: https://maps.google.com/?q=${location.latitude},${location.longitude}`
                      )
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-success m-2"
                  >
                    WhatsApp
                  </a>

                  <button
                    className="btn btn-primary m-2"
                    onClick={() => {
                      const message = `🚨 SOS from Trackly!\n${alertMessage}\nLocation: https://maps.google.com/?q=${location.latitude},${location.longitude}`;
                      selected.forEach((id) => {
                        const contact = contacts.find((c) => c._id === id);
                        if (contact) {
                          window.open(`sms:${contact.contactNumber}?&body=${encodeURIComponent(message)}`, "_blank");
                        }
                      });
                    }}
                  >
                    SMS
                  </button>
                </div>
              </div>
            )}
            <button className="btn btn-outline-secondary ml-2" onClick={onClose}>Cancel</button>
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

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    backdropFilter: "blur(6px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1050,
    overflow: "auto", // allow scroll
  },
  modal: {
    width: "90%",
    maxWidth: "500px",
    maxHeight: "90vh", // limits modal height
    overflowY: "auto", // make modal scrollable
    background: "#f9fefe",
    padding: "1.5rem",
    borderRadius: "10px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
};


export default SosAlertModal;
