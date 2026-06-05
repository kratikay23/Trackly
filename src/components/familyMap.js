import React, { useCallback, useEffect, useState } from "react";
import apiClient from "../apiClient";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import API from "../API";
import { useSelector } from "react-redux";

const mapContainerStyle = { width: "100%", height: "100%", minHeight: "240px" };
const defaultZoom = 14;


function FamilyMap() {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  const currentUserId = useSelector((state) => state.userData.user?._id);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_MAP_API
  });

  const updateMyLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition({ lat: latitude, lng: longitude });

        try {
          await apiClient.post(API.SAVE_USER_LOCATION, { latitude, longitude });
        } catch (err) {
        }
      },
      () => {}
    );
  }, []);

  const fetchFamilyLocations = useCallback(async () => {
    try {
      const res = await apiClient.get(API.FETCH_FAMILY_LOCATIONS);
      setFamilyMembers(res.data.members || []);
    } catch (err) {
    }
  }, []);

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
    <div className="family-map-root bg-light">
      <h2>Live Map</h2>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={currentPosition || { lat: 20.5937, lng: 78.9629 }}
        zoom={defaultZoom}
      >
        {familyMembers.map((member) => {
  const loc = member.UserLocation;
  if (!loc) return null;

            const isCurrentUser = String(member._id) === String(currentUserId);

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
