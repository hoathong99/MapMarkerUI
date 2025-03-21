import { useContext, useEffect, useState } from "react";
import { Artical } from "../DTO/interfaces";
import { ArticalContext } from "../../App";
import { OrderList } from 'primereact/orderlist';
import './MainPanel.css';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import leftPanelIcon from '../../assets/left_panel.png';

interface Props {
  articalLst: Artical[],
  onLoadMore: () => void;
  className?: string;
}

function exportToJson(data: unknown, filename: string = "data.json") {
  const jsonStr = JSON.stringify(data, null, 2); // Convert to JSON with formatting
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  // Cleanup
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const MainPanelComponent: React.FC<Props> = (prop: Props) => {
  const articalContext = useContext(ArticalContext);
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState<Artical[]>([]);
  const OnClickArtical = (artical: Artical) => {
    articalContext.setSelectedArtical(artical);
  }
  useEffect(() => {
    setData(prop.articalLst);
  }, [prop.articalLst]);

  const itemTemplate = (item: Artical) => {
    return (
      <div onClick={() => OnClickArtical(item)} className="InteractiveRow">
        <div>{item.header}</div>
        <div>{item.content}</div>
      </div>
    );
  };
  return (
    <>
      {/* <Button label="Primary" raised onClick={() => exportToJson(data)}/> */}

      <div className={prop.className || "Container"}>
        <div className="PanelHeader">
          <Sidebar visible={visible} onHide={() => setVisible(false)}>
            <div className="Body">
              <OrderList dataKey="id" value={data} itemTemplate={itemTemplate} header="Pin Boxes"></OrderList>
            </div>
          </Sidebar>
          <Button className="ExpandButton" visible={!visible}  icon="pi pi-arrow-right" onClick={() => setVisible(true)} />
        </div>
        {/* <div className="Header">
          <button onClick={prop.onLoadMore}>load more</button>
        </div> */}
      </div>
    </>
  )
}

export default MainPanelComponent;

