import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Shipment } from './shipment.model';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {
  private shipmentsSubject = new BehaviorSubject<Map<number, Shipment[]>>(new Map());
  
  shipments$ = this.shipmentsSubject.asObservable();

  addShipment(shipment: Shipment) {
    const shipmentsMap = this.shipmentsSubject.value;
    const shipmentsByType = shipmentsMap.get(shipment.typeId) || [];
    shipmentsByType.push(shipment);
    console.log("shipment")
    console.log(shipment)
    shipmentsMap.set(shipment.typeId, shipmentsByType);
    console.log("shipmentsMap")
    console.log(shipmentsMap)
    this.shipmentsSubject.next(shipmentsMap);
    console.log("shipmentsSubject")
    console.log( this.shipmentsSubject.value)
  }
}
