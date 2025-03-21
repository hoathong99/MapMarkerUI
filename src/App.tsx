import './App.css'
import MapMapPanelComponent from './components/MapDisplay/MapPanel'
import { Artical, Pin, sampleArticals } from './components/DTO/interfaces';
import MainPanelComponent from './components/MapDisplay/MainPanel';
import DetailPanel from './components/MapDisplay/DetailPanel';
import { createContext, useEffect, useState } from 'react';
import { LatLngTuple } from 'leaflet';
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";  // Theme (choose one)
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


async function fetchData(ID: string, Token: string): Promise<Artical[] | null> {                      // Should be Server call but use decenterlized localstorage for now

  // try {
  //   const response = await fetch("https://api.example.com/articles" + ID + Token);                 // temp url to fetch account inital data to display

  //   if (!response.ok) {
  //     throw new Error(`HTTP error! Status: ${response.status}`);
  //   }
  //   const data: Artical[] = await response.json();
  //   return data;

  // } catch (error) {
  //   console.error("Fetch error:", error);
  //   return null; // Return null on error
  // }
  if (localStorage.getItem("ArticalData")) {
    localStorage.setItem('ArticalData', JSON.stringify(sampleArticals));                                  // set tempo data
  }

  return JSON.parse(localStorage.getItem('ArticalData') || "{}");
}

async function fetchArticals(page: number, Token: string): Promise<Artical[] | null> {

  // try {
  //   const response = await fetch("https://api.example.com/articlesList" + page + Token);                 // temp url to fetch account inital data to display

  //   if (!response.ok) {
  //     throw new Error(`HTTP error! Status: ${response.status}`);
  //   }
  //   const data: Artical[] = await response.json();
  //   return data;

  // } catch (error) {
  //   console.error("Fetch error:", error);
  //   return []; // Return [] on error
  // }

  return sampleArticals;

}

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
export const FocusPinContext = createContext<{                                 //SHARED PIN TO FOCUS PIN FOR 2 LEFT COMPONENTS
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
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedArtical, setSelectedArtical] = useState<Artical>(emptyArtical);
  const [selectedPin, setSelectedPin] = useState<Pin>(emptyPin);
  const [focusPin, setFocusPin] = useState<Pin>(emptyPin);
  const [customPin, setCustomPin] = useState<Pin>(emptyPin);
  const [currentLocation, setCurrentLocation] = useState<LatLngTuple>();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const result = await fetchData("#UID", "#Token");                  //tempo
      if (result) {
        // console.log(result);
        setArticalLst(result)
      }
      else setError("Failed to load data");
      setLoading(false);
    };

    loadData();
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

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const result = await fetchArticals(page, "#Token");                               //tempo
      if (result) {
        setArticalLst([...articalLst, ...result]);                                      // add result to previous list
      }
      else setError("Failed to load data");
      setLoading(false);
    };

    loadData();
  }, [page]);

  const LoadMoreArtical = () => {
    setPage(prevPage => prevPage + 10);
  }


  useEffect(() => {
    UpdateLocalStorage(articalLst);
  }, [articalLst])

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
                <DetailPanel></DetailPanel>
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
