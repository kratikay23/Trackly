import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../API";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SosAlertPage = () => {
  const [countdown, setCountdown] = useState(5);
  const [showContacts, setShowContacts] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [alertMessage, setAlertMessage] = useState("SOS Alert - I need help!"); // 🆕 default message
  const { token } = useSelector((state) => state.userData);
  const navigate = useNavigate();

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
      const res = await axios.get(API.FETCH_ALL_EMERGENCY_CONTACT, {
        headers: { Authorization: token },
      });
      setContacts(res.data.contact || []);
    } catch (err) {
      console.error("Error fetching contacts", err);
    }
  };

  const sendAlert = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("📍 Location:", latitude, longitude, "| Accuracy:", position.coords.accuracy);

        for (const contactId of selected) {
          await axios.post(
            API.SOS_ALERT_TRIGGER,
            {
              latitude,
              longitude,
              alertMessage,
              emgId: contactId,
            },
            {
              headers: { Authorization: token },
            }
          );
        }

        alert("SOS alert sent successfully!");
        navigate("/");
      },
      (error) => {
        alert("Location permission denied");
      },
      {
        enableHighAccuracy: true, // ✅ this is the key part
        timeout: 10000,
        maximumAge: 0,
      }
    );

  };

  const cancelSos = () => {
    navigate("/dashboard");
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-sm">
        {!showContacts ? (
          <>
            <h4 className="mb-3">Emergency SOS Alert System</h4>
            <p className="text-muted">Sending SOS in {countdown} seconds...</p>
            <button className="btn btn-outline-danger" onClick={cancelSos}>
              Cancel SOS
            </button>
          </>
        ) : (
          <>
            <h5 className="mb-3">Select Emergency Contacts</h5>
            <ul className="list-group mb-3">
              {contacts.map((c) => (
                <li key={c.emgId} className="list-group-item">
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                    onChange={(e) => {
                      if (e.target.checked) setSelected([...selected, c.emgId]);
                      else setSelected(selected.filter((id) => id !== c.emgId));
                    }}
                  />
                  {c.name} - {c.contactNumber}
                </li>
              ))}
            </ul>

            <div className="mb-3">
              <label className="form-label fw-bold">Custom Alert Message</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Write a message to send with the SOS"
                value={alertMessage}
                onChange={(e) => setAlertMessage(e.target.value)}
              />
            </div>

            <button className="btn btn-danger" onClick={sendAlert}>
              🚨 Send SOS Alert
            </button>
            <button className="btn btn-outline-secondary ms-2" onClick={cancelSos}>
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SosAlertPage;
