import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import {NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from "@angular/router";
import { OrdersService } from "src/app/services/orders.service";
import { SettingService } from "src/app/services/setting.service";
import { ShipmentService } from './shipment.service';
import { Shipment } from './shipment.model';
import { UntypedFormGroup, UntypedFormBuilder, FormArray } from '@angular/forms';
import { WizardComponent as BaseWizardComponent } from 'angular-archwizard';



import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";

interface IdentifierValue {
  id: number;
  value: string;
}

interface IdentifierData {
  identifierId: number;
  identifierName: string;
  identifierValues: IdentifierValue[];
}

interface ApiResponse {
  success: boolean;
  code: number;
  description: string;
  data: IdentifierData[];
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {


  identifierId: any;
  identifierName: any;
  isLoading = false;
  status = null ;
   currentPage: any = 1;
  pageSize: any = 10;
  orderData:any = [];
  orderIdentifiersData:any = [];
  IdentifiersData:any = [];
  statusData:any = [];
  hoveredDate: NgbDate | null = null;
  search ="";
  Orderid: any;
  rejectReason ="";
  fromDate: NgbDate | null = null;
  toDate: NgbDate | null = null;
  formattedFromDate: string | null = "";
  formattedToDate: string | null = "";
  orderDate: NgbDate | null = null;
  formattedOrderDate: string | null = null;
  ShipmentTypeOptions = [
    { label: 'قوى بشرية', value: 1 },
    { label: ' حاويات', value: 2 },
    { label: 'ذخيرة', value: 3 },
    { label: 'براميل', value: 4 },
    { label: '  إسطوانات غاز', value: 5 },
    { label: 'مواد بناء', value: 6 }
  ];

  shipmentForm: FormGroup;
  shipments$ = this.shipmentService.shipments$;
  addedShipments: Shipment[] = [];

  selectedShipmentTypeFields: { label: string, field: string }[] = [];
  submitted = false;
  isOrderInfoFormSubmitted = false;
  sendeRecipientFormSubmitted = false;
  ShipmentFormFormSubmitted = false;



  shipmentTypes = [
    { id: 1, type: 'ذخيرة', fields: [
        { label: 'الطول', field: 'length' },
        { label: 'العرض', field: 'width' },
        { label: 'الارتفاع', field: 'height' },
        { label: 'الوزن', field: 'weight' },
        { label: 'العدد', field: 'quantity' },
        { label: 'نوع الذخيرة', field: 'AmmunitionType' },
        { label: 'الملاحظات', field: 'noteAmmunition' }
      ]
    },
    { id: 2, type: 'مواد بناء', fields: [
        { label: 'الطول', field: 'length' },
        { label: 'العرض', field: 'width' },
        { label: 'الارتفاع', field: 'height' },
        { label: 'الوزن', field: 'weight' },
        { label: 'العدد', field: 'quantity' },
        { label: 'الملاحظات', field: 'noteBuild' }
      ]
    },
    { id: 3, type: 'حاويات', fields: [
        { label: 'الطول', field: 'length' },
        { label: 'العرض', field: 'width' },
        { label: 'الارتفاع', field: 'height' },
        { label: 'الوزن', field: 'weight' },
        { label: 'العدد', field: 'quantity' },
        { label: 'الملاحظات', field: 'note2' }
      ]
    },
    { id: 4, type: 'براميل', fields: [
        { label: 'الطول', field: 'length' },
        { label: 'العرض', field: 'width' },
        { label: 'الارتفاع', field: 'height' },
        { label: 'الوزن', field: 'weight' },
        { label: 'العدد', field: 'quantity' },
        { label: 'الملاحظات', field: 'note3' }
      ]
    },
    { id: 5, type: 'إسطوانات غاز', fields: [
        { label: 'الطول', field: 'length' },
        { label: 'العرض', field: 'width' },
        { label: 'الارتفاع', field: 'height' },
        { label: 'الوزن', field: 'weight' },
        { label: 'العدد', field: 'quantity' },
        { label: 'الملاحظات', field: 'note3' }
      ]
    },
    { id: 6, type: 'قوى بشرية', fields: [
        { label: 'الاسم', field: 'name' },
        { label: 'الرتبة', field: 'rank' },
        { label: 'الرقم العسكري', field: 'militaryNumber' }
      ]
    }
  ];




  get otherFields(): FormGroup {
    return this.shipmentForm.get('otherFields') as FormGroup;
  }

  onShipmentTypeChange() {
    const typeId = Number(this.shipmentForm.get('typeId')!.value);
    console.log('Selected Type ID:', typeId);  // Debugging log
    console.log('Shipment Types:', this.shipmentTypes);  // Debugging log

    const shipmentType = this.shipmentTypes.find(st => st.id === typeId);

    if (shipmentType) {
      console.log('Selected Shipment Type:', shipmentType);  // Debugging log
      this.selectedShipmentTypeFields = shipmentType.fields;
      // Clear previous controls
      const otherFieldsGroup = this.fb.group({});
      shipmentType.fields.forEach(field => {
        otherFieldsGroup.addControl(field.field, this.fb.control('', Validators.required));
      });
      this.shipmentForm.setControl('otherFields', otherFieldsGroup);
    } else {
      console.log('No Shipment Type Found');  // Debugging log
      this.selectedShipmentTypeFields = [];
    }
  }

  addShipment() {
    this.submitted = true;
    this.ShipmentFormFormSubmitted = true;
    if (this.shipmentForm.valid) {
      const formValue = this.shipmentForm.value;
      const shipmentType = this.shipmentTypes.find(st => st.id === Number(formValue.typeId));

      if (shipmentType) {
        const newShipment: Shipment = {
          typeId: formValue.typeId,
          type: shipmentType.type,
          withVehicle: formValue.withVehicle,
          vehicleCode: formValue.vehicleCode,
          vehicleNumber: formValue.vehicleNumber,
          otherFields: formValue.otherFields
        };
        this.shipmentService.addShipment(newShipment);
        this.addedShipments.push(newShipment);
        console.log('Added Shipments:', this.addedShipments);
        this.resetForm();
      }
    }
  }

  resetForm() {
    this.submitted = false;
    this.ShipmentFormFormSubmitted = false;
    this.shipmentForm.reset();
    this.selectedShipmentTypeFields = [];
    this.initializeForm();
  }

  getFieldsForType(typeId: number): { label: string, field: string }[] {
    const shipmentType = this.shipmentTypes.find(t => t.id === typeId);
    return shipmentType ? shipmentType.fields : [];
  }


  @ViewChild('lgModal') lgModal: TemplateRef<any>;
  private modalRef: NgbModalRef;

  @ViewChild('reasonModal') reasonModal: TemplateRef<any>;
  private reasonmodalRef: NgbModalRef;


  orderInfoForm: UntypedFormGroup;
  SendeRecipientForm: UntypedFormGroup;
  ShipmentForm: UntypedFormGroup;



  @ViewChild('wizardForm') wizardForm: BaseWizardComponent;
  form!: FormGroup;
  orderForm: FormGroup;

  openreasonLgModal(){
    this.reasonmodalRef = this.modalService.open(this.reasonModal, { size: 'xl' });
  }


  

  constructor(
    public shipmentService: ShipmentService,
    private modalService: NgbModal,
    private ordersService: OrdersService,
    private fb: FormBuilder,

    private calendar: NgbCalendar, 
    public formatter: NgbDateParserFormatter,
    public settingService :SettingService,
    public formBuilder: UntypedFormBuilder
    ) {
   
    
    }
  



  ngOnInit(): void {
    this.initOrderForm();
    // this.getOrderswithPagination();
    // this.getOrderstatus();
    this.getIdentifiers();

    this.orderInfoForm = this.formBuilder.group({
      orderDstinations : [1, Validators.required],
      ExpectedDate : ['22-05-2024', Validators.required],
      priority : ['1', Validators.required],
      PurposeOfTransportation : ['test order', Validators.required],
      DestinationFrom: [1, Validators.required],
      DestinationTo: [2, Validators.required],
    });

   
    this.SendeRecipientForm = this.formBuilder.group({
      SenderDepartment : ['القسم المرسل', [Validators.required]],
      SenderMobileNumber : ['99334561', Validators.required],
      SenderPhoneNumber : ['99334562', Validators.required],
      RecipientDepartment : ['القسم المستلم', [Validators.required]],
      RecipientMobileNumber : ['99334563', Validators.required],
      RecipientPhoneNumber : ['99334564', Validators.required],
      SenderNote: ['-'],
      recipientNote: ['-'],
    });

  

    this.ShipmentForm = this.formBuilder.group({
      ShipmentType: [1, [Validators.required]],
      Length : ['122', Validators.required],
      width : ['12', Validators.required],
      weight : ['23', [Validators.required]],
      height : ['123', Validators.required],
      Qty : ['99334564', Validators.required],
      AmmunitionType : ['نوع الذخيرة'],
      Rank : ['الرتبة'],
      militaryNumber : ['الرقم العسكري'],
      militaryName : ['الاسم'],
      Note: ['-'],
      withVehicle: [false],
      vehicleCode: [''],
      vehicleNumber: ['']
   
  
    

    });




  


    // this.ShipmentForm.get('withVehicle')?.valueChanges.subscribe((value) => {
    //   if (value) {
    //     this.ShipmentForm.get('vehicleCode')?.setValidators(Validators.required);
    //     this.ShipmentForm.get('vehicleNumber')?.setValidators(Validators.required);
    //   } else {
    //     this.ShipmentForm.get('vehicleCode')?.clearValidators();
    //     this.ShipmentForm.get('vehicleNumber')?.clearValidators();
    //   }
    //   this.ShipmentForm.get('vehicleCode')?.updateValueAndValidity();
    //   this.ShipmentForm.get('vehicleNumber')?.updateValueAndValidity();
    // });


    // this.isOrderInfoFormSubmitted = false;
    // this.sendeRecipientFormSubmitted = false;
    // this.ShipmentFormFormSubmitted = false;

    this.initializeForm();
  }


  initializeForm() {
    this.shipmentForm = this.fb.group({
      typeId: ['', Validators.required],
      withVehicle: [false],
      vehicleCode: [''],
      vehicleNumber: [''],
      otherFields: this.fb.group({})
    });
    this.shipmentForm.get('withVehicle')?.valueChanges.subscribe((value) => {
      if (value) {
        this.shipmentForm.get('vehicleCode')?.setValidators(Validators.required);
        this.shipmentForm.get('vehicleNumber')?.setValidators(Validators.required);
      } else {
        this.shipmentForm.get('vehicleCode')?.clearValidators();
        this.shipmentForm.get('vehicleNumber')?.clearValidators();
      }
      this.shipmentForm.get('vehicleCode')?.updateValueAndValidity();
      this.shipmentForm.get('vehicleNumber')?.updateValueAndValidity();
    });
  }




  get OrderInfoFormfunc() {
    return this.orderInfoForm.controls;
  }

  get ShipmentFormfunc() {
    return this.ShipmentForm.controls;
  }

  /**
   * Returns form
   */
  get sendeRecipientFormFunc() {
    return this.SendeRecipientForm.controls;
  }


  ShipmentTypeValue = 3;
  orders:any = [];

  OrderInfoFormfuncSubmit() {
    if(this.orderInfoForm.valid) {
      this.wizardForm.goToNextStep();
    }
    this.isOrderInfoFormSubmitted = true;
  }

  // addShipment(): void {
  //   if (this.ShipmentForm.valid) {
  //     this.orders.push(this.ShipmentForm.value);
  //     this.ShipmentForm.reset();
  //     console.log( this.orders);
  //   }
  // }

  ShipmentFormfuncSubmit() {
    if(this.ShipmentForm.valid) {
      this.wizardForm.goToNextStep();
    }
    this.ShipmentFormFormSubmitted = true;
  }


  /**
   * Go to next step while form value is valid
   */
  form2Submit() {
    if(this.SendeRecipientForm.valid) {
      this.wizardForm.goToNextStep();
    }
    this.sendeRecipientFormSubmitted = true;
  }

  initOrderForm(){
    this.orderForm = this.fb.group({
      mechanism_Type: [null, [Validators.required]],
      shipment_Weight: [null, [Validators.required]],
      empty_Shipment_Weight: [null, [Validators.required]],
      shipment_Width: [null, [Validators.required]],
      shipment_Hight: [null, [Validators.required]],
      shipment_Type: [null, [Validators.required]],
      distance_Between_Axes: [null, [Validators.required]],
      hight_of_Back_and_Front_From_Ground: [null, [Validators.required]],
      number_of_Equipment: [null, [Validators.required]],
      number_of_Manpower: [null, [Validators.required]],
      departure: [null, [Validators.required]],
      arrival: [null, [Validators.required]],
      expected_Arrival_Date: [null, [Validators.required]],
      requester_Phone_Number: [null, [Validators.required]],
      requester_Mobile_Number: [null, [Validators.required]],
      receiver_Section: [null, [Validators.required]],
      receiver_Phone_Number: [null, [Validators.required]],
      receiver_Mobile_Number: [null, [Validators.required]],
      total_Weight: [null, [Validators.required]],
      order_Priority: [null, [Validators.required]],
      comments: [null, [Validators.required]],
    });
  }

  // {
  //   "requester_Entity": "string",
  //   "mechanism_Type": "string",
  //   "shipment_Weight": 0,
  //   "empty_Shipment_Weight": 0,
  //   "shipment_Width": 0,
  //   "shipment_Hight": 0,
  //   "shipment_Type": "string",
  //   "distance_Between_Axes": 0,
  //   "hight_of_Back_and_Front_From_Ground": 0,
  //   "portable_Power": 0,
  //   "number_of_Equipment": 0,
  //   "number_of_Manpower": 0,
  //   "departure": "string",
  //   "arrival": "string",
  //   "expected_Arrival_Date": "2024-05-24T06:49:53.250Z",
  //   "requester_Phone_Number": 0,
  //   "requester_Mobile_Number": "string",
  //   "receiver_Section": "string",
  //   "receiver_Phone_Number": 0,
  //   "receiver_Mobile_Number": "string",
  //   "total_Weight": 0,
  //   "order_Priority": "string",
  //   "comments": "string"
  // }
  


  onchangeFromDate(date: NgbDate | null): void {
    this.fromDate = date;
    this.formattedFromDate = this.formatDate(date);
    this.getOrderswithPagination();
  }

  

  onchangeOrderDate(date: NgbDate | null): void {
    this.orderDate = date;
    this.formattedOrderDate = this.formatDate(date);
  }


  onchangestatus(status:any): void {
    this.status = status;
    this.getOrderswithPagination();
  }
  onchangeToDate(date: NgbDate | null): void {
    this.toDate = date;
    console.log(date)
    this.formattedToDate = this.formatDate(date);
    console.log( this.formattedToDate)
    this.getOrderswithPagination();
  }

  
  formatDate(date: NgbDate | null): string | null {
    if (date === null) {
      return null;
    }

    const year = date.year;
    const month = date.month < 10 ? `0${date.month}` : date.month.toString();
    const day = date.day < 10 ? `0${date.day}` : date.day.toString();
    return ""+`${year}-${month}-${day}`;
  }


  getOrderstatus(){
    this.ordersService.getOrderstatus().subscribe(
      async (res: any) => {
        this.isLoading = false;
        this.statusData = res.data;
      },
      (err: { error: { code: number } }) => {
        this.isLoading = false;
      }
    );
  }
  getOrderswithPagination() {
    let params = {
      page: this.currentPage,
      pageSize: 10,
      search:this.search,
      from:  this.formattedFromDate ,
      to:  this.formattedToDate,
      // orderStatusType: this.status,
    };
    this.isLoading = true;
    this.ordersService.getOrderswithPagination(params).subscribe(
      async (res: any) => {
        this.isLoading = false;
        this.orderData = res.data;
      },
      (err: { error: { code: number } }) => {
        this.isLoading = false;
      }
    );
  }

  tableColumns = [
    {
      header: "رقم الطلب",
      field: "order_Code",
      type: "text",
      functionObject: null,
    },
    {
      header: " تاريخ الطلب",
      field: "order_Date",
      type: "date",
      functionObject: null,
    },
    {
      header: "حالة الطلب",
      field: "order_Status",
      type: "text",
      functionObject: null,
    },
    {
      header: "رقم المهمة",
      field: "mission_Code",
      type: "text",
      functionObject: null,
    },
  
    {
      header: "حالة المهمة",
      field: "mission_Status",
      type: "text",
      functionObject: null,
    },
    {
      header: "الجهة الطالبة",
      field: "requester_Entity",
      type: "text",
      functionObject: null,
    },
    {
      header: "الإجراء",
      field: "actions",
      type: "function",
      functionObject: [
        {
          label: "edit",
          action: (action: any, data: any) => this.editOrder(action, data),
        },
        {
          label: "accept",
          action: (action: any, data: any) => this.acceptOrder(action, data),
        },
        {
          label: "reject",
          action: (action: any, data: any) => this.rejectOrder(action, data),
        },
        {
          label: "delete",
          action: (action: any, data: any) => this.deleteOrder(action, data),
        },
        
      ],
    },
  ];


  Shipment = [
    {
      header: "الطول",
      field: "Length",
      type: "text",
      functionObject: null,
    },
    {
      header: "العرض",
      field: "width",
      type: "text",
      functionObject: null,
    },
    {
      header: "الارتفاع",
      field: "height",
      type: "text",
      functionObject: null,
    },
    {
      header: "الوزن",
      field: "weight",
      type: "text",
      functionObject: null,
    },
    {
      header: "العدد",
      field: "Qty",
      type: "text",
      functionObject: null,
    },
    {
      header: "نوع الذخيرة",
      field: "AmmunitionType",
      type: "text",
      functionObject: null,
    },
    // {
    //   header: "الاسم",
    //   field: "militaryName",
    //   type: "text",
    //   functionObject: null,
    // },
    // {
    //   header: "الرتبة",
    //   field: "Rank",
    //   type: "text",
    //   functionObject: null,
    // },
    // {
    //   header: " الرقم العسكري ",
    //   field: "militaryNumber",
    //   type: "text",
    //   functionObject: null,
    // },
  ];




  editOrder(action:any , data:any){

  }


  acceptOrder(action:any , data:any){
  let params =  {
      type : 2,
      reason: "string"
    }
    Swal.fire({
      title: "هل أنت متأكد",
      text: "تريد قبول هذا الطلب؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم",
    }).then((result) => {
      this.ordersService.AcceptOrders(data.id , params).subscribe(
        (res: any) => {
          this.getOrderswithPagination()
        
        }, err => {
        }
      );

      if (result.isConfirmed) {
        Swal.fire({
          title: "ممتاز!",
          text: "تم قبول هذا الطلب بنجاح",
          icon: "success",
        });
      }
    });

  }

  rejectOrder(action:any , data:any){
    this.Orderid =data.id ;
    this.reasonmodalRef = this.modalService.open(this.reasonModal, { size: 'lg' });
 
  }   

  sendRejections(){
       let params =  {
      type : 1,
      reason:this.rejectReason
    }
    Swal.fire({
      title: "هل أنت متأكد",
      text: "تريد قبول هذا الطلب؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم",
      cancelButtonText: "إغلاق",
    }).then((result) => {
      this.ordersService.AcceptOrders( this.Orderid, params).subscribe(
        (res: any) => {
          this.getOrderswithPagination()
          this.reasonmodalRef.close();
        }, err => {
        }
      );

      if (result.isConfirmed) {
        Swal.fire({
          title: "ممتاز!",
          text: "تم قبول هذا الطلب بنجاح",
          icon: "success",
        });
      }
    });
  }
  
  openLgModal(){
    this.modalRef = this.modalService.open(this.lgModal, { size: 'xl' });
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  initForm() {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
   
    });
  }

  date = null;
  isEnglish = false;



  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

  destinationsData:any =[];
  MechanismWeightsData:any =[];
  Ports:any =[];
  ShippingWeightsDats:any =[];
  CostPerKilo:any =[];

  getIdentifiers() {
    this.isLoading = true;
    this.settingService.getIdentifiers().subscribe(
      async (res: any) => {
        this.isLoading = false;
        this.IdentifiersData =res.data;
        
      // Parse JSON data
      const parsedData = res ;

      // Function to get the object by identifierName
      function getObjectByIdentifierName(data: IdentifierData[], identifierName: string): IdentifierData | undefined {
          return data.find(item => item.identifierName === identifierName);
      }

 
      this.destinationsData = getObjectByIdentifierName(parsedData.data, "الجهات");

      this.MechanismWeightsData = getObjectByIdentifierName(parsedData.data, "أوزان الآليات");

      this.Ports = getObjectByIdentifierName(parsedData.data, "الموانئ");

      this.ShippingWeightsDats = getObjectByIdentifierName(parsedData.data, "أوزان الشحن");

      this.CostPerKilo = getObjectByIdentifierName(parsedData.data, "تكلفة الكيلو");
        
      },
      (err: { error: { code: number } }) => {
        this.isLoading = false;
      }
    );
  }

    getObjectByIdentifierName(data: IdentifierData[], identifierName: string): IdentifierData | undefined {
      return data.find(item => item.identifierName === identifierName);
    }



    deleteOrder(action:any , data:any){
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        this.ordersService.deleterders(data.id).subscribe(
          (res: any) => {
            this.getOrderswithPagination()
          
          }, err => {
          }
        );
  
        if (result.isConfirmed) {
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
        }
      });
    }
    finishFunction() {
      alert('Successfully Completed');
    }

}
