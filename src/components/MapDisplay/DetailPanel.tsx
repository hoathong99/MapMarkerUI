import { useContext, useEffect, useRef, useState } from "react";
import { ArticalContext, FocusPinContext, PinContext } from "../../App";
import { Artical, Pin } from "../DTO/interfaces";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import { TreeNode } from "primereact/treenode";
import "./DetalPanel.css";
import { Card } from 'primereact/card';
import { InputTextarea } from "primereact/inputtextarea";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from 'primereact/dialog';

interface Props {
  onSubmit: (pin: Pin) => void;
  onUpdateArtical: (a: Artical) => void;
}

const emptyPin: Pin = {
  id: "",
  lat: "",
  lng: "",
  label: "",
  content: "",
};

const convertPinsToTreeNodes = (pins: Pin[]): TreeNode[] => {
  return pins.map((pin) => ({
    key: pin.id,
    data: {
      id: pin.id,
      lat: pin.lat,
      lng: pin.lng,
      label: pin.label,
      content: pin.content,
    },
  }));
};


function DetailPanelComponent(prop: Props) {
  // const focusPinContext = useContext(FocusPinContext);
  const [visible, setVisible] = useState<boolean>(false);
  const pinContext = useContext(PinContext);
  const articalContext = useContext(ArticalContext);
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const { register, handleSubmit, reset } = useForm<Pin>({ defaultValues: pinContext.selectedPin });
  let deleteTarget = useRef<TreeNode>({});

  const footerContent = (
    <div style={{display:"flex" ,padding:"5px", height:"2rem", gap:"1rem"}}>
      <Button size="large" label="No" icon="pi pi-times" onClick={() => setVisible(false)} autoFocus className="p-button-text" />
      <Button size="large" label="Yes" icon="pi pi-check" onClick={() => ExecuteDetele(deleteTarget.current)}  severity="danger" />
    </div>
  );

  const OpenDeleteDialog = (data: TreeNode) => {
    setVisible(true);
    deleteTarget.current = data;
  };

  const ExecuteDetele = (node: TreeNode) =>{
    let newPinList = articalContext.selectedArtical.List.filter((i) => i.id != node.data.id);
    let newArtical = structuredClone(articalContext.selectedArtical);
    newArtical.List = newPinList;
    console.log(newArtical);
    setVisible(false);
    prop.onUpdateArtical(newArtical);
  }

  const onSubmit = (data: Pin) => {
    prop.onSubmit(data);
  }

  const Delete = () => {
    // console.log(pinContext.selectedPin.label);
    let newPinList = articalContext.selectedArtical.List.filter((i) => i != pinContext.selectedPin);
    let newArtical = structuredClone(articalContext.selectedArtical);
    newArtical.List = newPinList;
    prop.onUpdateArtical(newArtical);
  }

  const FocusOnPin = () => {
    console.log(pinContext.selectedPin.label);
  }

  const actionTemplate = (a: TreeNode) => {
    return (
      <div className="buttonGroup">
        <Button type="button" icon="pi pi-search" severity="info" rounded onClick={FocusOnPin}></Button>
        <Button type="button" icon="pi pi-trash" severity="danger" rounded onClick={()=>OpenDeleteDialog(a)}></Button>
      </div>
    );
  };

  useEffect(() => {
    // if (articalContext.selectedArtical.List) {
      
    // }
    setNodes(convertPinsToTreeNodes(articalContext.selectedArtical.List));
  }, [articalContext]);

  useEffect(() => {
    reset(pinContext.selectedPin);
    setIsEditMode(false);
  }, [pinContext])

  if (pinContext.selectedPin == emptyPin) {
    return <></>;
  }

  return (
    <>
      <Card className="container">
        <div className="Header">
          <div style={{ textAlign: "center", padding: "10px", fontWeight: "bold" }}>{articalContext.selectedArtical.header}</div>
          <div>{articalContext.selectedArtical.content}</div>
        </div>
        <div className="Body">
          <div className="table">
            <TreeTable
              value={nodes}
              scrollable
              scrollHeight="50vh"
              selectionMode="single"
              selectionKeys={
                pinContext.selectedPin ? { [pinContext.selectedPin.id]: true } : null
              }
              onSelectionChange={(e) => {
                const selectedKey = e.value ? e.value : null;
                const selectedItem = articalContext.selectedArtical.List.find(item => item.id === selectedKey) || emptyPin;
                pinContext.setSelectedPin(selectedItem);
              }
              }
            >
              <Column field="label" header="Pin" style={{ height: '50px' }}></Column>
              <Column body={actionTemplate} headerClassName="w-10rem" />
            </TreeTable>
          </div>
          {pinContext.selectedPin.id && (
            <div className="Detail">
              {!isEditMode ? (
                <div>
                  <div style={{ display: "flex", justifyContent: "end" }}>
                    <button className="pi pi-pencil" onClick={() => setIsEditMode(!isEditMode)} ></button>
                  </div>
                  <div style={{ display: "inline-flex", alignItems: "center", width: "100%", marginBottom: "1rem" }}>
                    <div style={{ width: "100%", textAlign: "center", padding: "10px", fontWeight: "bold" }}>{pinContext.selectedPin.label}</div>
                  </div>
                  <div style={{ maxHeight: "40vh", overflow: "auto" }}>
                    <div>{pinContext.selectedPin.content}</div>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: "flex", justifyContent: "end" }}>
                    <button className="pi pi-pencil" onClick={() => setIsEditMode(!isEditMode)} ></button>
                  </div>
                  <form onSubmit={handleSubmit(data => onSubmit(data))}>
                    <div style={{ display: "inline-flex", alignItems: "center", width: "100%", marginBottom: "1rem" }}>
                      <InputText style={{ width: "90%", height: "2rem" }} required={true} {...register("label")} />
                    </div>
                    <div style={{ maxHeight: "40vh", overflow: "auto" }}>
                      <InputTextarea {...register("content")} rows={5} autoResize style={{ width: "90%" }} />
                    </div>
                    <div style={{ marginTop: "10px" }}>
                      <Button label="Save" size="large" type="submit" />
                    </div>
                  </form>
                </div>
              )
              }
            </div>
          )}
          <Dialog header="DELETE PIN CONFIRMATION" visible={visible} position={"right"} style={{ width: '20vw', right:"100px" }} onHide={() => { if (!visible) return; setVisible(false); }} footer={footerContent} draggable={false} resizable={false}>
            <div style={{display:"flex", justifyItems:"center", alignItems:"center", height:"100px", padding:"10px"}}>
              ARE YOU SURE?
            </div>
          </Dialog>
        </div>
      </Card>
    </>
  );
};

export default DetailPanelComponent;
