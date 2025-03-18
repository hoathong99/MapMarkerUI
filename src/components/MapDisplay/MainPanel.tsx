import { useEffect, useState } from "react"
import { Artical } from "../DTO/interfaces"

const apiUrl = "";

async function fetchData<T>(ID: string, Token: string): Promise<Artical[] | null> {

    try {
        const response = await fetch("https://api.example.com/articles"+ID+Token);                 // temp url to fetch account inital data to display
        
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data: Artical[] = await response.json();
      return data;
  
    } catch (error) {
      console.error("Fetch error:", error);
      return null; // Return null on error
    }
  }

  async function fetchArticals<T>(page: number, Token: string): Promise<Artical[] | null> {

    try {
        const response = await fetch("https://api.example.com/articlesList"+page+Token);                 // temp url to fetch account inital data to display
        
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data: Artical[] = await response.json();
      return data;
  
    } catch (error) {
      console.error("Fetch error:", error);
      return []; // Return [] on error
    }
  }

const MainPanel : React.FC = () => {
  const [data, setData] = useState<Artical[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      console.log(data,page,loading,error);                             //placeholder  
      setLoading(true);
      const result = await fetchData("#UID","#Token");                  //tempo
      if (result){
        setData(result)
      }
      else setError("Failed to load data");
      setLoading(false);
    };

    loadData();
  }, []); // Empty dependency = Runs once on mount


  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const result = await fetchArticals(page,"#Token");                  //tempo
      if (result){
        setData([...data, ...result]);                                      // add result to previous list
      }
      else setError("Failed to load data");
      setLoading(false);
    };

    loadData();
  }, [page]); // Empty dependency = Runs once on mount

  const LoadMoreArtical = () =>{
    setPage(prevPage => prevPage + 10);
  }
    return(
        <>
        <div className="Container">
        <div className="Header">

        </div>
        <div className="Body">
            <button onClick={LoadMoreArtical}>load more</button>
        </div>
        </div>
        </>
    )
}