
// export interface LocationMark {
//     id: string,
//     lat: number,
//     lng: number,
//     label: string,
// }

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
  
  
  export const sampleArticals: Artical[] = [
    {
      ID: "1",
      OwnerID: "user_001",
      header: "Historical Landmarks in Hanoi",
      content: "Explore some of the most famous historical landmarks in Hanoi.",
      List: [
        { id: "1", lat: "21.0285", lng: "105.8542", label: "Hoan Kiem Lake", content: "A scenic lake with the legendary Turtle Tower." },
        { id: "2", lat: "21.0379", lng: "105.8352", label: "Ho Chi Minh Mausoleum", content: "The final resting place of President Ho Chi Minh." },
        { id: "3", lat: "21.0358", lng: "105.8471", label: "Temple of Literature", content: "A historic temple dedicated to Confucius and scholars." },
        { id: "4", lat: "21.0419", lng: "105.8342", label: "One Pillar Pagoda", content: "A unique pagoda built on a single stone pillar." },
      ]
    },
    {
      ID: "2",
      OwnerID: "user_002",
      header: "Best Street Food Spots in Hanoi",
      content: "A guide to the must-visit street food locations in Hanoi.",
      List: [
        { id: "5", lat: "21.0328", lng: "105.8490", label: "Pho Bat Dan", content: "Famous for its traditional Hanoi-style Pho." },
        { id: "6", lat: "21.0292", lng: "105.8525", label: "Bun Cha Hang Quat", content: "Authentic Bun Cha served in a hidden alley." },
        { id: "7", lat: "21.0325", lng: "105.8478", label: "Banh Mi 25", content: "A popular place for delicious Vietnamese sandwiches." },
        { id: "8", lat: "21.0350", lng: "105.8533", label: "Xoi Yen", content: "A famous sticky rice shop loved by locals." },
      ]
    },
    {
      ID: "3",
      OwnerID: "user_003",
      header: "Cafes with the Best Views in Hanoi",
      content: "Enjoy a cup of coffee with a stunning view in these amazing cafes.",
      List: [
        { id: "9", lat: "21.0296", lng: "105.8537", label: "Cafe Dinh", content: "A hidden cafe with a view of Hoan Kiem Lake." },
        { id: "10", lat: "21.0308", lng: "105.8471", label: "The Note Coffee", content: "Famous for its walls covered in sticky notes." },
        { id: "11", lat: "21.0369", lng: "105.8348", label: "Tranquil Books & Coffee", content: "A peaceful cafe for book lovers." },
        { id: "12", lat: "21.0275", lng: "105.8310", label: "Serein Cafe", content: "A rooftop cafe with a stunning view of Long Bien Bridge." },
      ]
    },
    {
      ID: "4",
      OwnerID: "user_004",
      header: "Must-See Museums in Hanoi",
      content: "Discover the rich history and culture of Vietnam through these museums.",
      List: [
        { id: "13", lat: "21.0297", lng: "105.8328", label: "Vietnam Museum of Ethnology", content: "Showcases the diverse cultures of Vietnam's ethnic groups." },
        { id: "14", lat: "21.0295", lng: "105.8493", label: "Vietnamese Women's Museum", content: "A tribute to the role of women in Vietnamese history." },
        { id: "15", lat: "21.0323", lng: "105.8379", label: "Hoa Lo Prison Museum", content: "Also known as the 'Hanoi Hilton', a historic prison." },
        { id: "16", lat: "21.0354", lng: "105.8072", label: "Vietnam Fine Arts Museum", content: "Displays traditional and contemporary Vietnamese art." },
      ]
    }
  ];
  