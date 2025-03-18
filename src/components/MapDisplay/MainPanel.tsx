import { useContext, useEffect, useState } from "react";
import { Artical } from "../DTO/interfaces";
import { ArticalContext } from "../../App";

interface Props {
  articalLst: Artical[],
  onLoadMore: () => void;
}

const MainPanelComponent: React.FC<Props> = (prop: Props) => {
  const articalContext = useContext(ArticalContext);
  
  const [data, setData] = useState<Artical[]>([]);
  const OnClickArtical = (artical: Artical) => {
    articalContext.setSelectedArtical(artical);
  }
  useEffect(() => {
    setData(prop.articalLst);
  }, [prop.articalLst]);
  

  return (
    <>
      <div className="Container">
        <div className="Header">
        <button onClick={prop.onLoadMore}>load more</button>
        </div>
        <div className="Body">
          <ul>
            {data.map((item) => (
              <li key={item.ID} onClick={() => OnClickArtical(item)}>
                <div>
                  {item.header}
                </div>
                <div>
                  {item.content}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

export default MainPanelComponent;

