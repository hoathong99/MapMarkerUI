import { useContext, useEffect } from "react";
import { PinContext } from "../../App";
import { Pin } from "../DTO/interfaces";

const emptyPin: Pin = {
  id: "",
  lat: "0",
  lng: "0",
  label: "",
  content: ""
};

const DetailPanelComponent: React.FC = () => {
    const pinContext = useContext(PinContext);
    useEffect(()=>{
        console.log("selectedPin", pinContext.selectedPin);
    },[pinContext.selectedPin])
    if(pinContext.selectedPin == emptyPin){
        return(<></>)
    }
    return (
        <>
            <div className="Container">
                <div className="Header">
                    {pinContext.selectedPin.label}
                </div>
                <div className="Body">
                    <div>
                        {pinContext.selectedPin.lat} lat {pinContext.selectedPin.lng} ln
                    </div>
                    <div>
                        {pinContext.selectedPin.content}
                    </div>
                </div>
            </div>
        </>
    )
}

export default DetailPanelComponent;