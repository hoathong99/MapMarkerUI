import './App.css'
import MapMapPanelComponent from './components/MapDisplay/MapPanel'
import { Artical, Pin, sampleArticals } from './components/DTO/interfaces';
import MainPanelComponent from './components/MapDisplay/MainPanel';
import DetailPanel from './components/MapDisplay/DetailPanel';
import { createContext, useEffect, useState } from 'react';
import { LatLngTuple } from 'leaflet';
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";  // Theme (choose one)
import "primereact/resources/primereact.min.css";  // PrimeReact core styles
import "primeicons/primeicons.css";  // Icons
import "primeflex/primeflex.css";  // Flex utilities (optional)

const emptyArtical: Artical = {
  ID: "",
  OwnerID: "",
  List: [],
  content: "",
  header: ""
};


const emptyPin: Pin = {
  id: "",
  lat: "0",
  lng: "0",
  label: "",
  content: ""
};


function fetchData(): Artical[] {                                                                            // Should be Server call but use decenterlized localstorage for now
  // if (localStorage.getItem("ArticalData")) {
  // localStorage.setItem('ArticalData', JSON.stringify(sampleArticals));                                    // set tempo data
  // }
  // console.log(JSON.parse(localStorage.getItem('ArticalData')||""));

  return JSON.parse(localStorage.getItem('ArticalData')||"");
}

// async function fetchArticals(page: number, Token: string): Promise<Artical[] | null> {
//   return sampleArticals;
// }

function UpdateLocalStorage(artical: Artical[]) {
  localStorage.setItem('ArticalData', JSON.stringify(artical));
}

//----------------------EXPORT CONTEXT----------------------------------------------------//
export const ArticalContext = createContext<{                               //SHARED ARTICAL LIST FOR ALL 3 COMPONENTS
  selectedArtical: Artical;
  setSelectedArtical: (artical: Artical) => void;
}>({
  selectedArtical: emptyArtical,
  setSelectedArtical: () => { }
});
export const PinContext = createContext<{                                   //SHARED CURRENT SELECTED PIN FOR ALL 3 COMPONENTS
  selectedPin: Pin;
  setSelectedPin: (pin: Pin) => void;
}>({
  selectedPin: emptyPin,
  setSelectedPin: () => { }
});
export const FocusPinContext = createContext<{                               //SHARED PIN TO FOCUS PIN FOR 2 LEFT COMPONENTS 
  focusPin: Pin;
  setFocusPin: (pin: Pin) => void;
}>({
  focusPin: emptyPin,
  setFocusPin: () => { }
});
export const userCustomPin = createContext<{                                 //SHARED PIN TO USER INPUT PIN FOR 2 LEFT COMPONENTS
  customPin: Pin;
  setCustomPin: (pin: Pin) => void;
}>({
  customPin: emptyPin,
  setCustomPin: () => { }
});
//--------------------------------------------------------------------------------------------//

function App() {
  const [articalLst, setArticalLst] = useState<Artical[]>([]);
  // const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedArtical, setSelectedArtical] = useState<Artical>(emptyArtical);
  const [selectedPin, setSelectedPin] = useState<Pin>(emptyPin);
  const [focusPin, setFocusPin] = useState<Pin>(emptyPin);
  const [customPin, setCustomPin] = useState<Pin>(emptyPin);
  const [currentLocation, setCurrentLocation] = useState<LatLngTuple>();

  const updatePin = (articleID: string, updatedPin: Pin) => {
    let articalIndex = articalLst.findIndex((a) => a.ID == articleID)
    if (articalIndex != -1) {
      let pinIndex = articalLst[articalIndex].List.findIndex((p) => p.id == updatedPin.id);
      let Data = articalLst.concat();
      if (pinIndex != -1) {
        Data[articalIndex].List[pinIndex] = updatedPin;
        setArticalLst(Data);
      }
    }
  };

  const loadDataFromLS = () => {                                            //tempo
    // setLoading(true);         
    setArticalLst(fetchData())
    // setLoading(false);
    if (selectedArtical.ID != "") {
      setSelectedArtical(articalLst.find((a) => a.ID == selectedArtical.ID) || emptyArtical);
    }
    if (selectedPin != emptyPin) {
      setSelectedPin(articalLst.find((a) => a.ID == selectedArtical.ID)?.List.find((p) => p.id == selectedPin.id) || emptyPin);
    }
  };

  useEffect(() => {
    loadDataFromLS();
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // console.log(pos);
          setCurrentLocation([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => console.error("Geolocation error:", err.message),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // useEffect(() => {
  //   const loadData = async () => {
  //     setLoading(true);
  //     const result = await fetchArticals(page, "#Token");                               //tempo
  //     if (result) {
  //       setArticalLst([...articalLst, ...result]);                                      // add result to previous list
  //     }
  //     else setError("Failed to load data");
  //     setLoading(false);
  //   };

  //   loadData();
  // }, [page]);

  const LoadMoreArtical = () => {
    // setPage(prevPage => prevPage + 10);
  }

  const OnSubmitPin = (pin : Pin) => {
    if (selectedPin && selectedArtical) {
      updatePin(selectedArtical.ID, pin);
      UpdateLocalStorage(articalLst);
      loadDataFromLS();
    }
  }

   

  // useEffect(() => {
  //   UpdateLocalStorage(articalLst);
  // }, [articalLst])

  // useEffect(() => {                                                                               // Happen when a pin is submitted
  //   if (selectedPin && selectedArtical) {
  //     updatePin(selectedArtical.ID, focusPin);
  //     UpdateLocalStorage(articalLst);
  //     loadDataFromLS();
  //   }
  // }, [focusPin])

  return (
    <>
      <div className='AppContainer'>
        <userCustomPin.Provider value={{ customPin, setCustomPin }} >
          <ArticalContext.Provider value={{ selectedArtical, setSelectedArtical }}>
            <PinContext.Provider value={{ selectedPin, setSelectedPin }} >
              <FocusPinContext value={{ focusPin, setFocusPin }}>
                <div>
                  <MainPanelComponent className="MainPanel" onLoadMore={LoadMoreArtical} articalLst={articalLst}></MainPanelComponent>
                </div>
                <div>
                  <MapMapPanelComponent currentLocation={currentLocation}></MapMapPanelComponent>
                </div>
                <div>
                  <DetailPanel onSubmit={OnSubmitPin}></DetailPanel>
                </div>
              </FocusPinContext>
            </PinContext.Provider>
          </ArticalContext.Provider>
        </userCustomPin.Provider>
      </div>
    </>
  )
}

export default App
