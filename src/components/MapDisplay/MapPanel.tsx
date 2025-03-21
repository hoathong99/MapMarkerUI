import { useContext, useEffect, useRef, useState } from "react";
import { Pin } from "../DTO/interfaces";
import { ArticalContext, FocusPinContext, PinContext } from "../../App";
import { Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { MapContainer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngTuple } from "leaflet";
import L from "leaflet";
import personIcon from "../../assets/person_pin_circle.png";
import tempoPinIcon from "../../assets/tempPin.png";

const emptyPin: Pin = {
  id: "",
  lat: "0",
  lng: "0",
  label: "",
  content: "",
};

const customIcon = L.icon({
  iconUrl: personIcon,
  iconSize: [50, 50],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const userCustomPinIcon = new L.Icon({
  iconUrl: tempoPinIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});


interface Props {
  currentLocation?: LatLngTuple;
}
interface ClickableMapProps {
  setMarkerPosition: (position: LatLngTuple) => void;
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

// function FocusOnPin(pin? : Pin){
//   const map = useMap();
//   if(pin){
//     map.flyTo([Number(pin.lat), Number(pin.lng)], 14, {duration: 2})
//   }
// }

function ClickableMap(setMarkerPosition: ClickableMapProps) {
  useMapEvents({
    click(e) {
      setMarkerPosition.setMarkerPosition([e.latlng.lat, e.latlng.lng]); // Convert LatLng to LatLngTuple
    },
  });
  return null;
};

function MapMapPanelComponent(props: Props) {
  const articleContext = useContext(ArticalContext);
  const pinContext = useContext(PinContext);
  const forcusPinContext = useContext(FocusPinContext);

  const [markerPosition, setMarkerPosition] = useState<LatLngTuple | null>(null);
  const markerRefs = useRef<{ [key: string]: L.Marker | null }>({});
  const initialPosition: LatLngTuple = [21.035993051470584, 105.83367716525659]; // HN inital location
  const OnClickPin = (selected: Pin) => {
    pinContext.setSelectedPin(selected);
  };
  useEffect(() => {
    openPopup(pinContext.selectedPin.id);
  }, [pinContext]);

  useEffect(() => {
    forcusPinContext.setFocusPin({
      id: "",
      lat: markerPosition?.[0].toString() || "",
      lng: markerPosition?.[0].toString() || "",
      label: "",
      content: ""
    })
  }, [markerPosition]);

  const openPopup = (pinId: string) => {
    if (markerRefs.current[pinId]) {
      markerRefs.current[pinId]!.openPopup();
    }
  };

  return (
    <>
      <MapContainer
        center={initialPosition}
        zoom={13}
        style={{ height: "100vh", width: "70vw" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickableMap setMarkerPosition={setMarkerPosition} />
        <UserLocationUpdater
          currentLocation={props.currentLocation}
        ></UserLocationUpdater>
        {articleContext.selectedArtical.List.map((item) => (
          <Marker key={item.id}
            position={[Number(item.lat), Number(item.lng)]}
            ref={(e) => {
              if (e) {
                markerRefs.current[item.id] = e;
              }
            }}
            eventHandlers={{
              dblclick: () => { OnClickPin(item) },
            }}>
            <Popup>{item.label}</Popup>
          </Marker>

        ))}
        {markerPosition && (
          <Marker position={markerPosition} icon={userCustomPinIcon}>
            <Popup>
              Custom Marker <br /> {markerPosition[0].toFixed(5)}, {markerPosition[1].toFixed(5)}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </>
  );
}

export default MapMapPanelComponent;
