
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

  export const generateDummyArticals = (count: number): Artical[] => {
    return Array.from({ length: count }, (_, index) => ({
      ID: `artical-${index + 1}`,
      OwnerID: `owner-${index + 1}`,
      List: generateDummyPins(3), // Generate 3 dummy pins per article
      content: `This is the content for article ${index + 1}. It contains sample text for testing purposes.`,
      header: `Article Header ${index + 1}`
    }));
  };
  
  const generateDummyPins = (count: number): Pin[] => {
    return Array.from({ length: count }, (_, index) => ({
      id: `pin-${index + 1}`,
      lat: (Math.random() * 180 - 90).toFixed(6), // Random latitude (-90 to 90)
      lng: (Math.random() * 360 - 180).toFixed(6), // Random longitude (-180 to 180)
      label: `Pin ${index + 1}`,
      content: `This is a sample pin at location ${index + 1}`
    }));
  };
  
  