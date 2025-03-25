import { useContext, useEffect, useRef, useState } from "react";
import { Pin, NominatimResult } from "../DTO/interfaces";
import { ArticalContext, PinContext, userCustomPin } from "../../App";
import { Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { MapContainer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngTuple } from "leaflet";
import L from "leaflet";
import personIcon from "../../assets/person_pin_circle.png";
import tempoPinIcon from "../../assets/tempPin.png";
import customPin from "../../assets/Pin.png";
import searchPin from "../../assets/searchPin.png";
import { InputText } from "primereact/inputtext";
import { OrderList } from "primereact/orderlist";

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

const searchPinIcon = L.icon({
  iconUrl: searchPin,
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

const FlyToDestiny = ( props?: Props) => {
  if(props){
    const map = useMap();
    const [markerPosition, setMarkerPosition] = useState<LatLngTuple | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    useEffect(() => {
      if (props.currentLocation) {
        map.flyTo(props.currentLocation, 17, { duration: 2 }); // Smooth transition
        setMarkerPosition(props.currentLocation);
      }
    }, [props.currentLocation, map]);
  
    return markerPosition ? (
      <Marker
        icon={searchPinIcon}
        position={markerPosition}
        ref={(el) => {
          if (el) markerRef.current = el;
        }}
      >
        <Popup>Your Search</Popup>
      </Marker>
    ) : null;
  }
};

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
  const [textSearch, setTextSearch] = useState<string>("");
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [markerPosition, setMarkerPosition] = useState<LatLngTuple | null>(null);
  const [visibleSearchResult, setVisibleSearchResult] = useState(false);
  const customPinContext = useContext(userCustomPin);
  const markerRefs = useRef<{ [key: string]: L.Marker | null }>({});
  const [forcusPoint, setForcusPoint] = useState<LatLngTuple | null>(null);
  const initialPosition: LatLngTuple = [21.035993051470584, 105.83367716525659]; // HN inital location  : Chua Mot Cot

  const searchItemTemplate = (item: NominatimResult) => {
    return (
      <div onClick={()=>onSelectLocation(item)}>
        {item.name}|{item.display_name}-{"(" + item.addresstype + ")"}
      </div>
    );
  };

  const OnClickPin = (selected: Pin) => {
    pinContext.setSelectedPin(selected);
  };

  const openPopup = (pinId: string) => {
    // console.log("popup Pin", pinId);
    if (markerRefs.current[pinId]) {
      markerRefs.current[pinId]!.openPopup();
    }
  };

  const SearchLocation = async (str?: string) => {
    if (!str) return;
    if (!str.trim()) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(str)}`;

    try {
      const response = await fetch(url);
      const data: NominatimResult[] = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents form submission (if inside a form)
      SearchLocation(textSearch);
    }
  };

  const onSelectLocation = (n: NominatimResult) => {
    // FlyToLocation(n.lat, n.lon);
    setForcusPoint([parseFloat(n.lat),parseFloat(n.lon)]);
    setVisibleSearchResult(false);
    console.log("select location")
    setSearchResults([]);
  }

  useEffect(() => {
    // console.log("current Selected Pin", pinContext.selectedPin.id);
    openPopup(pinContext.selectedPin.id);
  }, [pinContext.selectedPin]);

  useEffect(() => {
    if(searchResults.length>0){
      setVisibleSearchResult(true);
    }else{
      setVisibleSearchResult(false);
    }
  }, [searchResults]);

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

  return (
    <>
      <div className="SearchBar" style={{ display: "block", position: "absolute", top: "2rem", right: "40vw", zIndex: "999", maxWidth:"25vw" }}>
        <InputText style={{ height: "2rem", width:"100%" }} placeholder="Search" value={textSearch} onChange={(e) => setTextSearch(e.target.value)} onKeyDown={handleKeyDown} />
        {visibleSearchResult && (
          <div style={{ maxHeight:"30vh", width:"100%" }}>
            <OrderList dataKey="place_id" value={searchResults} itemTemplate={searchItemTemplate}></OrderList>
          </div>
        )}
      </div>
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
        <FlyToDestiny currentLocation={forcusPoint||undefined}>
        </FlyToDestiny>
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
              <div style={{ display: "flex", justifyContent: "center" }}>
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
