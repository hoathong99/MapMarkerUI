
export interface LocationMark {
    id: string,
    lat: number,
    lng: number,
    label: string,
}

export interface Artical {
    ID: string;
    OwnerID: string;
    List: Pin[];
    content: string;
    header: string;
  }

export interface Pin {
    id: string;
    lat: string;
    lng: string;
    label: string;
    content: string;
  }
  