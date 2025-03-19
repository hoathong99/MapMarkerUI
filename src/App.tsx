import './App.css'
import MapMapPanelComponent from './components/MapDisplay/MapPanel'
import { Artical, generateDummyArticals, Pin, sampleArticals } from './components/DTO/interfaces';
import MainPanelComponent from './components/MapDisplay/MainPanel';
import DetailPanel from './components/MapDisplay/DetailPanel';
import { createContext, useEffect, useState } from 'react';
import { LatLngTuple } from 'leaflet';


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

// const dummyArticals = generateDummyArticals(10); // Generate 10 dummy articles

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
export const ArticalContext = createContext<{
  selectedArtical: Artical;
  setSelectedArtical: (artical: Artical) => void;
}>({
  selectedArtical: emptyArtical,
  setSelectedArtical: () => { }
});

export const PinContext = createContext<{
  selectedPin: Pin;
  setSelectedPin: (pin: Pin) => void;
}>({
  selectedPin: emptyPin,
  setSelectedPin: () => { }
});
//--------------------------------------------------------------------------------------------//

function App() {
  const [articalLst, setArticalLst] = useState<Artical[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedArtical, setSelectedArtical] = useState<Artical>(emptyArtical);
  const [selectedPin, setSelectedPin] = useState<Pin>(emptyPin);
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
          setCurrentLocation([pos.coords.latitude,pos.coords.longitude]) ;
        },
        (err) => console.error("Geolocation error:", err.message),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const result = await fetchArticals(page, "#Token");                  //tempo
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

  const HandleSelectedPin = () => {
    
  }

  // const HandleSelectedArtical = (artical: Artical) => {
  //   console.log("handle selected pin", artical.header);
  // }

  return (
    <>
      <div className='AppContainer'>
        <ArticalContext.Provider value={{ selectedArtical, setSelectedArtical }}>
          <PinContext.Provider value={{ selectedPin, setSelectedPin }} >
            <MainPanelComponent onLoadMore={LoadMoreArtical} articalLst={articalLst}></MainPanelComponent>
            <MapMapPanelComponent currentLocation={currentLocation}></MapMapPanelComponent>
            <DetailPanel></DetailPanel>
          </PinContext.Provider>
        </ArticalContext.Provider>
      </div>
    </>
  )
}

export default App
