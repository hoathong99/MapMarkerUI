import { useContext, useEffect, useRef, useState } from "react";
import { Pin } from "../DTO/interfaces";
import { ArticalContext, PinContext } from "../../App";
import { Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { MapContainer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngTuple } from "leaflet";
import L from "leaflet";
import personIcon from "../../assets/person_pin_circle.png";
const emptyPin: Pin = {
  id: "",
  lat: "0",
  lng: "0",
  label: "",
  content: "",
};

const customIcon = L.icon({
  iconUrl: personIcon, // Path to your marker image
  iconSize: [50, 50], // Size of the icon
  iconAnchor: [16, 32], // Point where the icon is anchored (center bottom)
  popupAnchor: [0, -32], // Popup position relative to the icon
});

interface Props {
  currentLocation?: LatLngTuple;
}

function UserLocationUpdater(props: Props) {
  const map = useMap();
  const [markerPosition, setMarkerPosition] = useState<LatLngTuple | null>(
    null
  );
  const markerRef = useRef<L.Marker | null>(null);
  // Update marker position only when location changes
  useEffect(() => {
    if (props.currentLocation) {
      map.flyTo(props.currentLocation, 14, { duration: 2 }); // Smooth transition
      setMarkerPosition(props.currentLocation);
    }
  }, [props.currentLocation, map]);

  return markerPosition ? (
    <Marker
      icon={customIcon}
      position={markerPosition}
      ref={(el) => {
        if (el) markerRef.current = el;
      }}
    >
      <Popup>Your Location</Popup>
    </Marker>
  ) : null;
}

function MapMapPanelComponent(props: Props) {
  const articleContext = useContext(ArticalContext);
  const pinContext = useContext(PinContext);

  const initialPosition: LatLngTuple = [21.035993051470584, 105.83367716525659]; // HN inital location
  const OnClickPin = (selected: Pin) => {
    console.log("clicked on pin");
    pinContext.setSelectedPin(selected);
  };
  // useEffect(() => {
  //   console.log(articleContext.selectedArtical);
  // }, [articleContext.selectedArtical]);

  return (
    <>
      <MapContainer
        center={initialPosition}
        zoom={13}
        style={{ height: "100vh", width: "70vw" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <UserLocationUpdater
          currentLocation={props.currentLocation}
        ></UserLocationUpdater>
        {articleContext.selectedArtical.List.map((item) => (
          <Marker key={item.id} 
                  position={[Number(item.lat), Number(item.lng)]}
                  eventHandlers={{
                    dblclick: (e) => {OnClickPin(item)},
                  }}>
            <Popup>{item.label}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}

export default MapMapPanelComponent;
