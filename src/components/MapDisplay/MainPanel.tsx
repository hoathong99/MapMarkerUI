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
import { Dialog } from "primereact/dialog";

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
  const [visibleDeleteDialog, setVisibleDeleteDialog] = useState<boolean>(false);
  let deleteTarget = useRef<Artical>(emptyArtical);

  const footerContent = (
    <div style={{ display: "flex", padding: "5px", height: "2rem", gap: "1rem" }}>
      <Button size="large" label="No" icon="pi pi-times" onClick={() => setVisibleDeleteDialog(false)} autoFocus className="p-button-text" />
      <Button size="large" label="Yes" icon="pi pi-check" onClick={() => DeleteArtical()} severity="danger" />
    </div>
  );

  const OnClickArtical = (artical: Artical) => {
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

  const OpenDeleteDialog = (a: Artical)=>{
    deleteTarget.current=a;
    setVisibleDeleteDialog(true);
    console.log(deleteTarget.current);
  }

  const DeleteArtical = () => {
    console.log(deleteTarget.current);
    prop.onDeleteArtical(deleteTarget.current);
    setVisibleDeleteDialog(false);
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
        <div onClick={() => OnClickArtical(item)} style={{ width: "80%" }}>
          <div style={{ fontWeight: "bold" }}>{item.header}</div>
          <div>{item.content}</div>
        </div>
        <div style={{ display: "flex", width: "20%", justifyContent: "end", alignItems: "center", paddingRight: "5px" }}>
          <Button type="button" icon="pi pi-trash" severity="danger" rounded onClick={() => OpenDeleteDialog(item)}></Button>
        </div>
      </div>
    );
  };
  return (
    <>
      <div className={prop.className || "Container"}>
        <div className="PanelHeader">
          <Sidebar visible={visibleSidePanel} onHide={() => setVisibleSidePanel(false)}>
            <div className="Body">
              <div>
                <Button onClick={() => OpenPanel()}>ADD</Button>
              </div>
              <OrderList
                dataKey="id"
                value={data}
                itemTemplate={itemTemplate}
                header="Pin Boxes"
              ></OrderList>
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
            PIN CONTENT
            <InputTextarea
              {...register("content")}
              rows={10}
              autoResize
              style={{ width: "90%" }}
            />
          </div>
          <div style={{ marginTop: "10px" }}>
            <Button label="Save" size="large" type="submit" />
          </div>
        </form>
      </Sidebar>
      <Dialog header="DELETE ARTICLE CONFIRMATION" visible={visibleDeleteDialog} position={"center"} style={{ width: '20vw', right: "100px" }} onHide={() => { if (!visibleDeleteDialog) return; setVisibleDeleteDialog(false); }} footer={footerContent} draggable={false} resizable={false}>
        <div style={{ display: "flex", justifyItems: "center", alignItems: "center", height: "100px", padding: "10px" }}>
          ARE YOU SURE?
        </div>
      </Dialog>
    </>
  );
};

export default MainPanelComponent;
