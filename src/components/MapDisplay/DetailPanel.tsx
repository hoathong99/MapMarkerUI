import { useContext, useEffect, useRef, useState } from "react";
import { ArticalContext, PinContext, userCustomPin } from "../../App";
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
import { Sidebar } from 'primereact/sidebar';
import { Toast } from 'primereact/toast';
import { v4 as uuidv4 } from 'uuid';
import { FileUpload } from 'primereact/fileupload';

interface Props {
  onSubmit: (pin: Pin) => void;
  onUpdateArtical: (a: Artical) => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onDeleteArtical: (a: Artical) => void;
}

const emptyPin: Pin = {
  id: "",
  lat: "",
  lng: "",
  label: "",
  content: "",
};

const emptyArtical: Artical = {
  ID: "",
  OwnerID: "",
  List: [],
  content: "",
  header: "",
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [visibleDeleteArticalDialog, setVisibleDeleteArticalDialog] = useState<boolean>(false);
  const fileUploadRef = useRef<FileUpload | null>(null);
  const customPinContext = useContext(userCustomPin);
  const [visible, setVisible] = useState<boolean>(false);
  const [visiblePanel, setVisiblePanel] = useState(false);
  const pinContext = useContext(PinContext);
  const articalContext = useContext(ArticalContext);
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const { register, handleSubmit, reset } = useForm<Pin>({ defaultValues: pinContext.selectedPin });
  let deleteTarget = useRef<TreeNode>({});
  let customPin = useRef<Pin>(emptyPin);
  const deleteArticalTarget = useRef<Artical>(emptyArtical);
  const toast = useRef<Toast>(null);
  const [isSync, setIsSync] = useState<boolean>(false);

  const footerContent = (
    <div style={{ display: "flex", padding: "5px", height: "2rem", gap: "1rem" }}>
      <Button size="large" label="No" icon="pi pi-times" onClick={() => setVisible(false)} autoFocus className="p-button-text" />
      <Button size="large" label="Yes" icon="pi pi-check" onClick={() => ExecuteDetele(deleteTarget.current)} severity="danger" />
    </div>
  );

  const footerDeleteArticalDialog = (
    <div style={{ display: "flex", padding: "5px", height: "2rem", gap: "1rem" }}>
      <Button size="large" label="No" icon="pi pi-times" onClick={() => setVisibleDeleteArticalDialog(false)} autoFocus className="p-button-text" />
      <Button size="large" label="Yes" icon="pi pi-check" onClick={() => DeleteArtical()} severity="danger" />
    </div>
  );

  const OpenDeleteDialog = (data: TreeNode) => {
    setVisible(true);
    deleteTarget.current = data;
  };

  const OpenDeleteArticalDialog = (a: Artical)=>{
    deleteArticalTarget.current=a;
    setVisibleDeleteArticalDialog(true);
    // console.log(deleteTarget.current);
  }

  const DeleteArtical = () => {
    // console.log(deleteArticalTarget.current);
    prop.onDeleteArtical(deleteArticalTarget.current);
    setVisibleDeleteArticalDialog(false);
  };

  const handleFileSelect = (event: any) => {
    const file = event.files[0];
    if (file && file.type !== "application/json") {
      alert("Only .json files are allowed!");
      return;
    }
    setSelectedFile(file);
    if (fileUploadRef.current) {
      fileUploadRef.current.clear();
    }
  };

  const ExecuteDetele = (node: TreeNode) => {
    let newPinList = articalContext.selectedArtical.List.filter((i) => i.id != node.data.id);
    let newArtical = structuredClone(articalContext.selectedArtical);
    newArtical.List = newPinList;
    // console.log(newArtical);
    setVisible(false);
    prop.onUpdateArtical(newArtical);
    toast.current?.show({ severity: 'info', summary: 'Success', detail: 'Delete Completed' });
  }

  const onSubmit = (data: Pin) => {
    prop.onSubmit(data);
    toast.current?.show({ severity: 'info', summary: 'Success', detail: 'Update Completed' });
  }

  const onSubmitNewPin = (p: Pin) => {
    articalContext.selectedArtical.List.push(p);
    pinContext.setSelectedPin(p);
    let newPinList = articalContext.selectedArtical.List.concat();
    let newArtical = structuredClone(articalContext.selectedArtical);
    newArtical.List = newPinList;
    // console.log(newArtical);
    prop.onUpdateArtical(newArtical);
    setVisiblePanel(false);
    toast.current?.show({ severity: 'info', summary: 'Success', detail: 'Update Completed' });
  }

  const OnClickExport = () => {
    prop.onExport();
  }

  const OnClickImport = () => {
    if (selectedFile) {
      prop.onImport(selectedFile);
      toast.current?.show({ severity: 'info', summary: 'Success', detail: 'Sync Completed' });
    }
    setSelectedFile(null);
  }

  const OnUpload = (data: any) => {
    console.log(data);
    toast.current?.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
  };

  const FocusOnPin = () => {
    // console.log(pinContext.selectedPin.label);
  }

  const OpenAddPinPanel = () => {
    if (customPinContext.customPin.lat != "") {
      setVisiblePanel(true);
      setIsEditMode(false);
      customPin.current.id = uuidv4();
      customPin.current.lat = customPinContext.customPin.lat;
      customPin.current.lng = customPinContext.customPin.lng;
      reset(customPin.current);
    } else {
      toast.current?.show({ severity: "info", summary: 'Need Action', detail: 'Click on the map for pin location!', life: 3000 });
    }
  }

  const actionTemplate = (a: TreeNode) => {
    return (
      <div className="buttonGroup">
        <Button type="button" icon="pi pi-search" severity="info" rounded onClick={FocusOnPin}></Button>
        <Button type="button" icon="pi pi-trash" severity="danger" rounded onClick={() => OpenDeleteDialog(a)}></Button>
      </div>
    );
  };

  const ClickOnEditMode = () => {
    setIsEditMode(!isEditMode);
    reset(pinContext.selectedPin);
  }

  useEffect(() => {
    setNodes(convertPinsToTreeNodes(articalContext.selectedArtical.List));
  }, [articalContext]);

  useEffect(() => {
    reset(pinContext.selectedPin);
    setIsEditMode(false);
  }, [pinContext])

  useEffect(() => {
    if (selectedFile) {
      setIsSync(true);
    } else {
      setIsSync(false);
    }
  }, [selectedFile]);
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
          {articalContext.selectedArtical.ID != "" && (
            <div className="Action" style={{ display: "flex", width: "100%", justifyContent: "end" }}>
              <Button type="button" icon="pi pi-plus" severity="success" rounded onClick={() => { OpenAddPinPanel() }}></Button>
              <Button type="button" icon="pi pi-trash" severity="danger" rounded onClick={() => { OpenDeleteArticalDialog(articalContext.selectedArtical) }}></Button>
            </div>
          )}
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
                    <button className="pi pi-pencil" onClick={() => ClickOnEditMode()} ></button>
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
                    <InputText style={{ display: "none" }} required={true} {...register("id")} />
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
          <Sidebar visible={visiblePanel} position="right" onHide={() => setVisiblePanel(false)}>
            <form onSubmit={handleSubmit(data => onSubmitNewPin(data))}>
              <div style={{ display: "inline-flex", alignItems: "center", width: "100%", marginBottom: "1rem" }}>
                <div style={{ width: "15%", height: "2rem" }}>Label: </div>
                <InputText style={{ width: "75%", height: "2rem" }} required={true} {...register("label")} />
              </div>
              <div>
                LAT <InputText style={{ width: "90%", height: "2rem" }} disabled required={true} {...register("lat")} />
                LNG <InputText style={{ width: "90%", height: "2rem" }} disabled required={true} {...register("lng")} />
              </div>
              <div style={{ maxHeight: "70vh", overflow: "auto" }}>
                PIN CONTENT
                <InputTextarea {...register("content")} rows={10} autoResize style={{ width: "90%" }} />
              </div>
              <div style={{ marginTop: "10px" }}>
                <Button label="Save" size="large" type="submit" />
              </div>
            </form>
          </Sidebar>
          <Toast ref={toast} />
        </div>
        <div className="Footer" style={{ display: "flex", justifyContent: "center", gap: "5px" }}>
          <Button style={{ height: "2rem", width: "5rem", display: "flex", justifyItems: "center" }} type="button" icon="pi pi-file-export" severity="info" onClick={() => OnClickExport()}></Button>
          <FileUpload style={{ height: "2rem", display: "flex", justifyItems: "center" }} ref={fileUploadRef} mode="basic" name="jsonFile" customUpload accept=".json" maxFileSize={1000000} onUpload={OnUpload} chooseLabel={selectedFile ? selectedFile.name : "Upload Json File"} onSelect={handleFileSelect} />
          <Button visible={isSync} style={{ height: "2rem", width: "5rem", display: "flex", justifyItems: "center" }} type="button" icon="pi pi-sync" label="sync" severity="warning" onClick={() => OnClickImport()}></Button>
        </div>
        <Dialog header="DELETE PIN CONFIRMATION" visible={visible} position={"right"} style={{ width: '20vw', right: "100px" }} onHide={() => { if (!visible) return; setVisible(false); }} footer={footerContent} draggable={false} resizable={false}>
          <div style={{ display: "flex", justifyItems: "center", alignItems: "center", height: "100px", padding: "10px" }}>
            ARE YOU SURE?
          </div>
        </Dialog>
        <Dialog header="DELETE ARTICAL CONFIRMATION" visible={visibleDeleteArticalDialog} position={"right"} style={{ width: '20vw', right: "100px" }} onHide={() => { if (!visibleDeleteArticalDialog) return; setVisibleDeleteArticalDialog(false); }} footer={footerDeleteArticalDialog} draggable={false} resizable={false}>
          <div style={{ display: "flex", justifyItems: "center", alignItems: "center", height: "100px", padding: "10px" }}>
            ARE YOU SURE?
          </div>
        </Dialog>
      </Card>
    </>
  );
};

export default DetailPanelComponent;
