// export interface Shipment {
//     type: string;
//     length?: number;
//     width?: number;
//     height?: number;
//     weight?: number;
//     quantity?: number;
//     otherFields?: { [key: string]: any };
//   }
  

  export interface Shipment {
    typeId: number;
    type: string;
    vehicleNumber?: number;
    vehicleCode?: number;
    withVehicle: boolean;
    otherFields: { [key: string]: any };
  }