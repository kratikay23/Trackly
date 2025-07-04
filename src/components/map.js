import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import React, { useCallback, useEffect, useState } from "react";

function Map() {
    const [currentPosition, setCurrentPosition] = useState(null);
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_MAP_API
    });

    const getUserLoation = useCallback(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCurrentPosition({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                })
            },
            (error) => {
                console.error("Error getting in location", error);
            }
        )
    }, []);
    useEffect(() => {
        getUserLoation();
        const interval = setInterval(getUserLoation, 2000);// update in every 2sec
        return () => { clearInterval(interval) }; //cleanup
    }, [getUserLoation]);
    if (!isLoaded) {
        return <p>Loading Map</p>;
    }
    return <>
        <div className="mt-3">
            {currentPosition ? (
                <GoogleMap mapContainerStyle={{ width: "100%", height: "300px" }}
                    center={currentPosition}
                    zoom={15}>
                    <Marker position={currentPosition} />

                </GoogleMap>
            ) : (
                <p className="text-muted">Fetching your location</p>
            )}
        </div>
    </>
}

export default React.memo(Map);