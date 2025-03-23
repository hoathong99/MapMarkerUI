import { useContext, useEffect, useState } from "react";
import { ArticalContext, FocusPinContext, PinContext } from "../../App";
import { Pin } from "../DTO/interfaces";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import { TreeNode } from "primereact/treenode";
import "./DetalPanel.css";
import { Card } from 'primereact/card';
import { InputTextarea } from "primereact/inputtextarea";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

interface Props {
  onSubmit: (pin: Pin) => void;
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
  const focusPinContext = useContext(FocusPinContext);
  const pinContext = useContext(PinContext);
  const articalContext = useContext(ArticalContext);
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const { register, handleSubmit, watch, formState: { errors }, reset, getValues } = useForm<Pin>({ defaultValues: pinContext.selectedPin });

  const onSubmit = (data: Pin) => {
    prop.onSubmit(data);
    // focusPinContext.setFocusPin(data);
  }

  useEffect(() => {
    if (articalContext.selectedArtical.List) {
      setNodes(convertPinsToTreeNodes(articalContext.selectedArtical.List));
    }
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
              {/* <Column field="content" header="Describe"></Column> */}
            </TreeTable>
          </div>
          {pinContext.selectedPin.id && (
            <div className="Detail">
              {!isEditMode ? (
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", width: "100%", marginBottom: "1rem" }}>
                    <div style={{ width: "100%", textAlign: "center", padding: "10px", fontWeight: "bold" }}>{pinContext.selectedPin.label}</div>
                    <button className="pi pi-pencil" style={{ justifySelf: "end" }} onClick={() => setIsEditMode(!isEditMode)} ></button>
                  </div>
                  <div style={{ maxHeight: "40vh", overflow: "auto" }}>
                    <p>{pinContext.selectedPin.content}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(data => onSubmit(data))}>
                  <div style={{ display: "inline-flex", alignItems: "center", width: "100%", marginBottom: "1rem" }}>
                    <InputText style={{ width: "100%", height: "2rem" }} required={true} {...register("label")} />
                    <button className="pi pi-pencil" style={{ justifySelf: "end" }} onClick={() => setIsEditMode(!isEditMode)} ></button>
                  </div>
                  <div style={{ maxHeight: "40vh", overflow: "auto" }}>
                    <InputTextarea {...register("content")} rows={5} autoResize style={{ width: "90%" }} />
                  </div>
                  <div style={{ marginTop: "10px" }}>
                    <Button label="Save" size="large" type="submit" />
                  </div>
                </form>
              )
              }
            </div>
          )}

        </div>
      </Card>
    </>
  );
};

export default DetailPanelComponent;
