import './App.css'
import MapMapPanelComponent from './components/MapDisplay/MapPanel'
import { Artical, Pin, sampleArticals } from './components/DTO/interfaces';
import MainPanelComponent from './components/MapDisplay/MainPanel';
import DetailPanel from './components/MapDisplay/DetailPanel';
import { createContext, useEffect, useState } from 'react';
import { LatLngTuple } from 'leaflet';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import "primereact/resources/themes/soho-dark/theme.css";  // Theme (choose one)
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


async function fetchData(ID: string, Token: string): Promise<Artical[] | null> {

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

  return sampleArticals;
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
//--------------------------------------------------------------------------------------------//

function App() {
  const [articalLst, setArticalLst] = useState<Artical[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedArtical, setSelectedArtical] = useState<Artical>(emptyArtical);
  const [selectedPin, setSelectedPin] = useState<Pin>(emptyPin);
  const [focusPin, setFocusPin] = useState<Pin>(emptyPin);
  const [currentLocation, setCurrentLocation] = useState<LatLngTuple>();
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const result = await fetchData("#UID", "#Token");                  //tempo
      if (result) {
        setArticalLst(result)
      }
      else setError("Failed to load data");
      setLoading(false);
    };

    loadData();
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          console.log(pos);
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

  useEffect(()=>{
    console.log(focusPin);
  },[focusPin])
  return (
    <>
      <div className='AppContainer'>
        <ArticalContext.Provider value={{ selectedArtical, setSelectedArtical }}>
          <PinContext.Provider value={{ selectedPin, setSelectedPin }} >
            <FocusPinContext value={{ focusPin, setFocusPin }}>
              <Splitter>
                <SplitterPanel className="flex justify-content-center" size={15} minSize={10}>
                  <MainPanelComponent className="MainPanel" onLoadMore={LoadMoreArtical} articalLst={articalLst}></MainPanelComponent>
                </SplitterPanel>
                <SplitterPanel className="flex justify-content-center" size={70} minSize={60}>
                  <MapMapPanelComponent currentLocation={currentLocation}></MapMapPanelComponent>
                </SplitterPanel>
                <SplitterPanel className="flex justify-content-center">
                  <DetailPanel></DetailPanel>
                </SplitterPanel>
              </Splitter>
            </FocusPinContext>
          </PinContext.Provider>
        </ArticalContext.Provider>
      </div>
    </>
  )
}

export default App
