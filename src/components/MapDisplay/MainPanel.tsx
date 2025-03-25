import { useContext, useEffect, useRef, useState } from "react";
import { Artical } from "../DTO/interfaces";
import { ArticalContext } from "../../App";
import { OrderList } from "primereact/orderlist";
import "./MainPanel.css";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import logo from "../../assets/Logo.png"

const emptyArtical: Artical = {
  ID: "",
  OwnerID: "",
  List: [],
  content: "",
  header: "",
};

interface Props {
  articalLst: Artical[];
  onSubmitNewArtical: (a: Artical) => void;
  className?: string;
  onDeleteArtical: (a: Artical) => void;
}

const MainPanelComponent: React.FC<Props> = (prop: Props) => {
  const articalContext = useContext(ArticalContext);
  const { register, handleSubmit, reset } = useForm<Artical>({
    defaultValues: emptyArtical,
  });
  const [visibleSidePanel, setVisibleSidePanel] = useState(false);
  const [visibleRegisterPanel, setVisibleRegisterPanel] =
    useState<boolean>(false);
  const [data, setData] = useState<Artical[]>([]);
  const selectTable = useRef<OrderList>(null);
  const deleteTarget = useRef<Artical>(emptyArtical);

  const OnClickArtical = (artical: Artical) => {
    console.log("clicked");
    articalContext.setSelectedArtical(artical);
  };

  const onSubmitArtical = (data: Artical) => {
    prop.onSubmitNewArtical(data);
    reset(emptyArtical);
    setVisibleRegisterPanel(false);
  };

  const OpenPanel = () => {
    setVisibleRegisterPanel(true);
  };

  useEffect(() => {
    setData(prop.articalLst);
  }, [prop.articalLst]);

  const itemTemplate = (item: Artical) => {
    return (
      <div
        style={{ display: "flex" }}
        className="InteractiveRow"
      >
        <div onClick={() => OnClickArtical(item)} style={{ width: "100%" }}>
          <div style={{ fontWeight: "bold" }}>{item.header}</div>
          <div>{item.content}</div>
        </div>
      </div>
    );
  };
  return (
    <>
      <div className={prop.className || "Container"}>
        <div className="PanelHeader">
          <Sidebar visible={visibleSidePanel} onHide={() => setVisibleSidePanel(false)}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img style={{ margin: "20px", top: "50px" }} src={logo} alt="Logo" height="80px" />
            </div>
            <div className="Body">
              <OrderList
                focusOnHover={true}
                ref={selectTable}
                dataKey="ID"
                value={data}
                itemTemplate={itemTemplate}
                header="Pin Boxes"
              ></OrderList>
              <div style={{ display: "flex", justifyContent: "end", padding: "5px", gap:"5px" }}>
                <Button style={{ display: "flex", alignItems: "center", height: "2rem" }} className="pi pi-share-alt" size="large" severity="info" onClick={() => OpenPanel()}>Share</Button>
                <Button style={{ display: "flex", alignItems: "center", height: "2rem" }} className="pi pi-plus" size="large" severity="success" onClick={() => OpenPanel()}>New</Button>
              </div>
            </div>
          </Sidebar>
          <Button
            className="ExpandButton"
            visible={!visibleSidePanel}
            icon="pi pi-arrow-right"
            onClick={() => setVisibleSidePanel(true)}
          />
        </div>
      </div>
      <Sidebar
        visible={visibleRegisterPanel}
        position="left"
        onHide={() => setVisibleRegisterPanel(false)}
      >
        <form onSubmit={handleSubmit((data) => onSubmitArtical(data))}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              width: "100%",
              marginBottom: "1rem",
            }}
          >
            <div style={{ width: "15%", height: "2rem" }}>Label: </div>
            <InputText
              style={{ width: "75%", height: "2rem" }}
              required={true}
              {...register("header")}
            />
          </div>
          <div style={{ maxHeight: "70vh", overflow: "auto" }}>
            CONTENT
            <InputTextarea
              {...register("content")}
              rows={10}
              autoResize
              style={{ width: "90%" }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
            <Button label="Save" size="large" style={{ width: "5rem" }} type="submit" />
          </div>
        </form>
      </Sidebar>
    </>
  );
};

export default MainPanelComponent;
