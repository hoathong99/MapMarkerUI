import { useContext, useEffect, useRef, useState } from "react";
import { Pin } from "../DTO/interfaces";
import { ArticalContext, PinContext, userCustomPin } from "../../App";
import { Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { MapContainer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngTuple } from "leaflet";
import L from "leaflet";
import personIcon from "../../assets/person_pin_circle.png";
import tempoPinIcon from "../../assets/tempPin.png";
import customPin from "../../assets/Pin.png";
// import { OpenStreetMapProvider , GeoSearchControl } from "leaflet-geosearch";

// const emptyPin: Pin = {
//   id: "",
//   lat: "0",
//   lng: "0",
//   label: "",
//   content: "",
// };

const customIcon = L.icon({
  iconUrl: personIcon,
  iconSize: [50, 50],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const pinIcon = L.icon({
  iconUrl: customPin,
  iconSize: [40, 40],
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

// const SearchField = () => {
//   const map = useMap();
//   const provider = new OpenStreetMapProvider();
//   useEffect(() => {
//     let searchControl = new OpenStreetMapProvider({
//       provider,
//       style: "bar",
//       showMarker: true,
//       showPopup: true,
//     });
  
//     map.addControl(searchControl);
  
//     // ✅ Correct cleanup function: Removes search control when component unmounts
//     return () => {
//       map.removeControl(searchControl);
//     };
//   }, [map]);

//   return null;
// };


function UserLocationUpdater(props: Props) {                                        // take in current user location, display custom pin and fly to that pin
  const map = useMap();                                                             // If no user location, map center is set to default: Chua Mot Cot [21.035993051470584, 105.83367716525659]
  const [markerPosition, setMarkerPosition] = useState<LatLngTuple | null>(null);
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
      // useContext(PinContext).setSelectedPin(emptyPin);                    // reset selected pin to empty so current selected pin do popup (tempo fix)
    },
  });
  return null;
};

function MapMapPanelComponent(props: Props) {
  const articleContext = useContext(ArticalContext);
  const pinContext = useContext(PinContext);
  // const forcusPinContext = useContext(FocusPinContext);
  const customPinContext = useContext(userCustomPin);
  const [markerPosition, setMarkerPosition] = useState<LatLngTuple | null>(null);
  const markerRefs = useRef<{ [key: string]: L.Marker | null }>({});
  const initialPosition: LatLngTuple = [21.035993051470584, 105.83367716525659]; // HN inital location  : Chua Mot Cot
  const OnClickPin = (selected: Pin) => {
    pinContext.setSelectedPin(selected);
  };
  useEffect(() => {
    // console.log("current Selected Pin", pinContext.selectedPin.id);
    openPopup(pinContext.selectedPin.id);
  }, [pinContext.selectedPin]);

  useEffect(() => {
    customPinContext.setCustomPin({
      id: "",
      lat: markerPosition?.[0].toString() || "",
      lng: markerPosition?.[1].toString() || "",
      label: "",
      content: ""
    })
    console.log(customPinContext.customPin);
  }, [markerPosition]);

  const openPopup = (pinId: string) => {
    // console.log("popup Pin", pinId);
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
            icon={pinIcon}
            position={[Number(item.lat), Number(item.lng)]}
            ref={(e) => {
              if (e) {
                markerRefs.current[item.id] = e;
              }
            }}
            eventHandlers={{
              dblclick: () => { OnClickPin(item) },
            }}>
            <Popup>
                <div style={{display:"flex", justifyContent:"center"}}>
                  {item.label}
                </div>
                <div>
                  {item.lat}{", "}{item.lng}
                </div>
            </Popup>
          </Marker>

        ))}
        {markerPosition && (
          <Marker position={markerPosition} icon={userCustomPinIcon}>
            <Popup>
              Your custom marker <br /> {markerPosition[0].toFixed(5)}, {markerPosition[1].toFixed(5)}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </>
  );
}

export default MapMapPanelComponent;
