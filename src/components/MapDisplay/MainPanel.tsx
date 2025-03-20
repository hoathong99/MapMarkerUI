import { useContext, useEffect, useState } from "react";
import { Artical } from "../DTO/interfaces";
import { ArticalContext } from "../../App";
import { OrderList } from 'primereact/orderlist';
import './MainPanel.css';

interface Props {
  articalLst: Artical[],
  onLoadMore: () => void;
  className?: string;
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

  const itemTemplate = (item:Artical) => {
    return (
      <div onClick={() => OnClickArtical(item)} className="InteractiveRow">
        {item.header}
        {item.content}
      </div>
    );
  };
  return (
    <>
      <div className={prop.className || "Container"}>
        <div className="Header">
          <button onClick={prop.onLoadMore}>load more</button>
        </div>
        <div className="Body">
          <OrderList dataKey="id" value={data} itemTemplate={itemTemplate} header="Pins" ></OrderList>
        </div>
      </div>
    </>
  )
}

export default MainPanelComponent;

