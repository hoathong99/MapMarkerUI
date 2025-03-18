import React, { useContext, useEffect, useState } from "react";
import { AdvancedMarker, Map, APIProvider } from "@vis.gl/react-google-maps";
import { LocationMark, Pin } from "../DTO/interfaces"
import { ArticalContext, PinContext } from "../../App";

const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your API key

const containerStyle = {
  width: "100%",
  height: "400px",
};

const emptyPin: Pin = {
  id: "",
  lat: "0",
  lng: "0",
  label: "",
  content: ""
};


const MapMapPanelComponent: React.FC = () => {
  const articleContext = useContext(ArticalContext);

  const locations: Pin[] = articleContext.selectedArtical.List;
  const center: Pin = emptyPin;
  const pinContext = useContext(PinContext);

  useEffect(() => {
    console.log(pinContext.selectedPin);
  }, [pinContext.selectedPin]); // Empty dependency array -> Runs only once

  const OnClickPin = (selected: Pin) => {
    pinContext.setSelectedPin(selected);
  };

  return (
    // <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
    //     <Map style={containerStyle} defaultCenter={{ lat: center.lat, lng: center.lng }} defaultZoom={8}>
    //         {locations.map((location, index) => (
    //             <AdvancedMarker
    //                 key={index}
    //                 position={{ lat: location.lat, lng: location.lng }}
    //                 onClick={() => handleMarkerClick(location)}
    //             >
    //                 <Pin background={'blue'} borderColor={'black'} glyphColor={'white'}>
    //                     {location.label}
    //                 </Pin>
    //             </AdvancedMarker>
    //         ))}
    //     </Map>
    // </APIProvider>

    <>
      <div>
        Center: {center.label}
      </div>
      <ul>
        {locations.map((item) => (
          <li key={item.id} onClick={() => OnClickPin(item)}>
            <div>
              {item.label}
              <span>{item.lat} lat {item.lng} lng</span>
            </div>
            <div>
              {item.content}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default MapMapPanelComponent;
