import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";
import { useSelector } from "react-redux";

function SOSAlert() {
  const { token, user } = useSelector((state) => state.userData);
  const [contacts, setContacts] = useState([]);
  const [selectedEmgId, setSelectedEmgId] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await axios.get(API.FETCH_ALL_EMERGENCY_CONTACT, {
        headers: { Authorization: token },
      });
      setContacts(res.data.contact);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const handleSendSOS = async () => {
    if (!selectedEmgId) return alert("Please select a contact");
    setLoading(true);

    try {
      // Get location from browser
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const name = user?.userName;
        const payload = {
          name,
          latitude,
          longitude,
          alertMessage: alertMessage || "Help me!",
          emgId: selectedEmgId,
        };

        const msg = await axios.post(API.SEND_SOS, payload, {
          headers: { Authorization: token },
        });
        console.log("SOS alert....", msg)
        alert("SOS Alert sent successfully");
        setLoading(false);
        setSelectedEmgId("");
        setAlertMessage("");
      }, (err) => {
        console.error("Geolocation error:", err);
        alert("Location access denied");
        setLoading(false);
      });
    } catch (error) {
      console.error("SOS send error:", error);
      alert("Failed to send SOS");
      setLoading(false);
    }
  };

  return (
    <div className="card p-4 border-0 shadow-sm">
      <h5>Send SOS Alert</h5>

      <div className="mb-3">
        <label className="form-label">Select Emergency Contact</label>
        <select
          className="form-select"
          value={selectedEmgId}
          onChange={(e) => setSelectedEmgId(e.target.value)}
        >
          <option value="">-- Choose Contact --</option>
          {contacts.map((c) => (
            <option key={c.emgId} value={c.emgId}>
              {c.name} ({c.contactNumber})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Custom Message (Optional)</label>
        <textarea
          className="form-control"
          rows={2}
          placeholder="Type your SOS message"
          value={alertMessage}
          onChange={(e) => setAlertMessage(e.target.value)}
        />
      </div>

      <button
        className="btn btn-danger"
        onClick={handleSendSOS}
        disabled={loading}
      >
        {loading ? "Sending..." : "🔴 Send SOS Alert"}
      </button>
    </div>
  );
}

export default SOSAlert;
