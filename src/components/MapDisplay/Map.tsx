import React, { useEffect, useState } from "react";
import { AdvancedMarker, Pin, Map, APIProvider } from "@vis.gl/react-google-maps";
import {LocationMark} from "../DTO/interfaces"

interface Prop {
    list: LocationMark[],
    heading: string,
    centerMark: LocationMark
}

const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your API key

const containerStyle = {
    width: "100%",
    height: "400px",
};


// Example list of coordinates with content

const MapComponent: React.FC<Prop> = (input: Prop) => {
    const locations: LocationMark[] = input.list;
    const center: LocationMark = input.centerMark;
    const [selectedLocation, setSelectedLocation] = useState<LocationMark | null>(null);

    useEffect(() => {
        console.log("Component mounted");
      }, []); // Empty dependency array -> Runs only once

    const handleMarkerClick = (selected: LocationMark) => {
        setSelectedLocation(selected);
    };

    return (
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
            <Map style={containerStyle} defaultCenter={{ lat: center.lat, lng: center.lng }} defaultZoom={8}>
                {locations.map((location, index) => (
                    <AdvancedMarker
                        key={index}
                        position={{ lat: location.lat, lng: location.lng }}
                        onClick={() => handleMarkerClick(location)}
                    >
                        <Pin background={'blue'} borderColor={'black'} glyphColor={'white'}>
                            {location.label}
                        </Pin>
                    </AdvancedMarker>
                ))}
            </Map>
        </APIProvider>
    );
};

export default MapComponent;
