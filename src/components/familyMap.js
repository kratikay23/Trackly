import React, { useCallback, useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import API from "../API";
import { useSelector } from "react-redux";

const mapContainerStyle = { width: "100%", height: "80%" };
const defaultZoom = 14;

const blueIcon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png?v=1";
const redIcon = "http://maps.google.com/mapfiles/ms/icons/red-dot.png?v=1";

function FamilyMap() {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
const token = useSelector((state) => state.userData.token);
const currentUserId = useSelector((state) => state.userData.user._id); // 👈 yaha se

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_MAP_API
  });

  const updateMyLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition({ lat: latitude, lng: longitude });

        try {
          await axios.post(API.SAVE_USER_LOCATION, { latitude, longitude }, {
            headers: { Authorization: token }
          });
        } catch (err) {
          console.error("Location update failed", err);
        }
      },
      (err) => console.error("Location access denied", err)
    );
  }, [token]);

  const fetchFamilyLocations = useCallback(async () => {
    try {
      const res = await axios.get(API.FETCH_FAMILY_LOCATIONS, {
        headers: { Authorization: token }
      });
      console.log("Fetched Members:", res.data.members);
      setFamilyMembers(res.data.members || []);
    } catch (err) {
      console.error("Failed to fetch family locations", err);
    }
  }, [token]);

  useEffect(() => {
    updateMyLocation();
    fetchFamilyLocations();

    const interval = setInterval(() => {
      updateMyLocation();
      fetchFamilyLocations();
    }, 10000);

    return () => clearInterval(interval);
  }, [updateMyLocation, fetchFamilyLocations]);

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div style={{ width: "100%", height: "100%" }} className="bg-light">
      <h2>Live Map</h2>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={currentPosition || { lat: 20.5937, lng: 78.9629 }}
        zoom={defaultZoom}
      >
        {familyMembers.map((member) => {
  const loc = member.UserLocation;
  if (!loc) return null;

  const isCurrentUser = member._id === currentUserId;

  return (
    <Marker
      key={member._id}
      position={{ lat: loc.latitude, lng: loc.longitude }}
      icon={isCurrentUser
        ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        : "http://maps.google.com/mapfiles/ms/icons/red-dot.png"}
      label={member.userName[0]}
      onClick={() => setSelectedMember(member)}
    />
  );
})}


        {selectedMember && (
          <InfoWindow
            position={{
              lat: selectedMember.UserLocation.latitude,
              lng: selectedMember.UserLocation.longitude,
            }}
            onCloseClick={() => setSelectedMember(null)}
          >
            <div>
              <strong>{selectedMember.userName}</strong><br />
              <small>{selectedMember.role}</small><br />
              <small>
                Last updated:{" "}
                {new Date(selectedMember.UserLocation.updatedAt).toLocaleString()}
              </small>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      <div className="bg-light">
        <p className="text-dark">Track your Family live location....</p>
      </div>
    </div>
  );
}

export default React.memo(FamilyMap);
