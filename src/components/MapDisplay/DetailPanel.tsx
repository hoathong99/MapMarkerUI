import { useContext, useEffect, useState } from "react";
import { ArticalContext, PinContext } from "../../App";
import { Pin } from "../DTO/interfaces";
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
import { TreeNode } from "primereact/treenode";
import "./DetalPanel.css";

const emptyPin: Pin = {
    id: "",
    lat: "0",
    lng: "0",
    label: "",
    content: ""
};

const convertPinsToTreeNodes = (pins: Pin[]): TreeNode[] => {
    return pins.map((pin) => ({
        key: pin.id,
        data: {
            id: pin.id,
            lat: pin.lat,
            lng: pin.lng,
            label: pin.label,
            content: pin.content
        }
    }));
};


const DetailPanelComponent: React.FC = () => {
    const pinContext = useContext(PinContext);
    const articalContext = useContext(ArticalContext);
    const [nodes, setNodes] = useState<TreeNode[]>([]);

    useEffect(() => {
        if (articalContext.selectedArtical.List) {
            setNodes(convertPinsToTreeNodes(articalContext.selectedArtical.List));
        }
    }, [pinContext.selectedPin])

    if (pinContext.selectedPin == emptyPin) {
        return (<></>)
    }
    return (
        <>
            <div className="Container">
                <div className="Header">
                    {articalContext.selectedArtical.header}
                    {articalContext.selectedArtical.content}
                </div>
                <div className="Body">
                    <div className="table">
                        <TreeTable value={nodes} scrollable scrollHeight="30vh">
                            <Column field="label" header="Name" expander></Column>
                            <Column field="content" header="Content"></Column>
                        </TreeTable>
                    </div>
                    <div>
                        {pinContext.selectedPin.lat} lat {pinContext.selectedPin.lng} ln
                    </div>
                    <div>
                        {pinContext.selectedPin.content}
                    </div>
                </div>
            </div>
        </>
    )
}

export default DetailPanelComponent;