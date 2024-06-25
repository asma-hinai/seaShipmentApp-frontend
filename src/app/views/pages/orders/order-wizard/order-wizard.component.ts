import { Component, OnInit, TemplateRef, ViewChild , AfterViewInit , AfterViewChecked} from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import {NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { OrdersService } from "src/app/services/orders.service";
import { SettingService } from "src/app/services/setting.service";
import { ShipmentService } from '../shipment.service';

import { UntypedFormGroup, UntypedFormBuilder, FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WizardComponent } from 'angular-archwizard';
import { BehaviorSubject } from "rxjs";

interface IdentifierValue {
  id: number;
  value: string;
}

interface IdentifierData {
  identifierId: number;
  identifierName: string;
  identifierValues: IdentifierValue[];
}

interface Field {
  field: string;
  type?: string; // Optional field to specify input types like 'text', 'number', etc.
  options?: string[]; // Optional field for select, radio types
}

interface Subtype {
  label: string;
  fields: Field[];
}

interface Shipment {
  typeId: number;
  subtypeId?: string;
  otherFields: { [key: string]: any };
}


@Component({
  selector: 'app-order-wizard',
  templateUrl: './order-wizard.component.html',
  styleUrls: ['./order-wizard.component.scss']
})

export class OrderWizardComponent implements OnInit {
  destinationsData:any =[];
  MechanismWeightsData:any =[];
  Ports:any =[];
  ShippingWeightsDats:any =[];
  CostPerKilo:any =[];
  orderInfoForm: UntypedFormGroup;
  SendeRecipientForm: UntypedFormGroup;
  ShipmentForm: UntypedFormGroup;
  form!: FormGroup;
  orderForm: FormGroup;
  isLoading = false;
  orderIdentifiersData:any = [];
  IdentifiersData:any = [];
  isShipmentFormSubmitted = false;

 

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
    this.getIdentifiers();
    this.initializeForm();
  }




  
  @ViewChild('wizardForm') wizardForm: WizardComponent;

  isWizardInitialized = false;


  ngAfterViewChecked() {
    if (!this.isWizardInitialized) {
      if (this.wizardForm) {
        this.isWizardInitialized = true;
        console.log('Wizard Form:', this.wizardForm);
      }
    }
  }

  validateOrderInfoForm() {
    this.isOrderInfoFormSubmitted = true;
    if (this.orderInfoForm.valid) {
      console.log(this.wizardForm);
      this.wizardForm.goToNextStep();
    } else {
      console.log('Order Info Form is invalid');
    }
  }

  validateShipmentForm() {
    this.isShipmentFormSubmitted = true
    console.log(this.form.valid);
    if (this.form.valid) {

      this.wizardForm.goToNextStep();
    } else {
      console.log('Order Info Form is invalid');
    }
  }



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


  
  shipmentTypes: any = [

    { 
      id: 1, 
      type: 'ذخيرة', 
      fields: [
        { label: 'الطول', field: 'length', type: 'text' },
        { label: 'العرض', field: 'width', type: 'text' },
        { label: 'الارتفاع', field: 'height', type: 'text' },
        { label: 'الوزن', field: 'weight', type: 'text' },
        { label: 'العدد', field: 'quantity', type: 'number' },
        { label: 'نوع الذخيرة', field: 'AmmunitionType', type: 'select', options: ['Type 1', 'Type 2'] },
        { label: 'الملاحظات', field: 'noteAmmunition', type: 'textarea' }
      ]
    },
    { 
    
      id: 2, 
      type: 'مواد بناء', 
      fields: [
        { label: 'الطول', field: 'length', type: 'text' },
        { label: 'العرض', field: 'width', type: 'text' },
        { label: 'الارتفاع', field: 'height', type: 'text' },
        { label: 'الوزن', field: 'weight', type: 'text' },
        { label: 'العدد', field: 'quantity', type: 'number' },
        { label: 'الملاحظات', field: 'noteBuild', type: 'textarea' }
      ]
    },
    { 
   
      id: 3, 
      type: 'حاويات', 
      fields: [
        { label: 'الطول', field: 'length', type: 'text' },
        { label: 'العرض', field: 'width', type: 'text' },
        { label: 'الارتفاع', field: 'height', type: 'text' },
        { label: 'الوزن', field: 'weight', type: 'text' },
        { label: 'العدد', field: 'quantity', type: 'number' },
        { label: 'الملاحظات', field: 'noteContainers', type: 'textarea' }
      ]
    },
    { 
      id: 4, 
      type: 'براميل', 
      fields: [
        { label: 'الطول', field: 'length', type: 'text' },
        { label: 'العرض', field: 'width', type: 'text' },
        { label: 'الارتفاع', field: 'height', type: 'text' },
        { label: 'الوزن', field: 'weight', type: 'text' },
        { label: 'العدد', field: 'quantity', type: 'number' },
        { label: 'الملاحظات', field: 'noteBarrels', type: 'textarea' }
      ]
    },
    { 
      id: 5, 
      type: 'إسطوانات غاز', 
      fields: [
        { label: 'الطول', field: 'length', type: 'text' },
        { label: 'العرض', field: 'width', type: 'text' },
        { label: 'الارتفاع', field: 'height', type: 'text' },
        { label: 'الوزن', field: 'weight', type: 'text' },
        { label: 'العدد', field: 'quantity', type: 'number' },
        { label: 'الملاحظات', field: 'noteGasCylinders', type: 'textarea' }
      ]
    },

    {  
   
      id: 6,  
      type: 'قوى بشرية - عسكري', 
      fields: [
        { label: 'الرتبة', field: 'rank', type: 'text' },
        { label: 'الرقم العسكري', field: 'militaryNumber', type: 'text' },
        { label: 'الاسم', field: 'name', type: 'text' },
        { label: 'ضابط/فرد', field: 'officer_individual', type: 'radio', options: ['ضابط', 'فرد'] },
        { label: 'مع سلاح ام لا', field: 'weapon', type: 'checkbox' },
        { label: 'الجنس', field: 'gender', type: 'select', options: ['ذكر', 'أنثى'] }
      ]
    },
    {  
   
      id: 7,  
      type: 'قوى بشرية - مدني', 
      fields: [
        { label: 'الاسم', field: 'name', type: 'text' },
        { label: 'الرقم المدني أو رقم الجواز', field: 'ID', type: 'text' },
        { label: 'الجنسية', field: 'nationality', type: 'text' },
        { label: 'الجنس', field: 'gender', type: 'select', options: ['ذكر', 'أنثى'] }
      ]
    },
  
  ];
  



 
  





  // shipmentForm: FormGroup;
  private shipmentsSubject = new BehaviorSubject<Map<number, Shipment[]>>(new Map());
  shipments$ = new BehaviorSubject<Map<number, Shipment[]>>(new Map());

  submitted = false;
  isOrderInfoFormSubmitted = false;
  sendeRecipientFormSubmitted = false;
  ShipmentFormFormSubmitted = false;


  initializeForm() {


    this.orderInfoForm = this.formBuilder.group({
      orderDstinations : [1, Validators.required],
      ExpectedDateFrom : ['22-05-2024', Validators.required],
      ExpectedDateTo : ['22-05-2024', Validators.required],
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
      length : [null, Validators.required],
      width : [null, Validators.required],
      weight : [null, [Validators.required]],
      height : [null, Validators.required],
      quantity : [null, Validators.required],
      AmmunitionType : [null],
      noteAmmunition : [null],
      
      rank : [null],
      militaryNumber : [null],
      name : [null],
      noteGasCylinders: [null],
    
   
  
    

    });


    // this.shipmentForm = this.fb.group({
    //   typeId: ['', Validators.required],
    //   subtypeId: [''],
    //   length: [''],
    //   width: [''],
    //   height: [''],
    //   weight: [''],
    //   AmmunitionType: [''],

    //   noteAmmunition: [''],
    //   noteBuild: [''],
    //   quantity: [''],
    //   noteBarrels: [''],
    //   noteContainers: [''],
    //   noteGasCylinders: [''],



    //   rank: [''],
    //   militaryNumber: [''],
    //   name: [''],
    //   officer_individual: [''],
    //   weapon: [''],
    //   gender: [''],
    //   ID: [''],
    //   nationality: [''],

   
    
    //   otherFields: this.fb.group({}) // Ensure this is always initialized
    // });



    this.shipmentForm = this.fb.group({
      typeId: ['', Validators.required],
      subtypeId: [''],
      otherFields: this.fb.group({})
    });
  this.shipmentForm.get('typeId')?.valueChanges.subscribe(() => {
    this.onShipmentTypeChange();
  });
  this.shipmentForm.get('subtypeId')?.valueChanges.subscribe(() => {
    this.onSubtypeChange();
  });

    this.form = this.fb.group({
      loadType: ['', Validators.required],
      vehicleType: ['working'],

      
      vehicleCode: ['', Validators.required],
      vehicleNumber: ['', Validators.required],
      vehicleLength: ['', Validators.required],
      vehicleWidth: ['', Validators.required],
      vehicleHeight: ['', Validators.required],
      vehicleWeight: ['', Validators.required],
      distanceBetweenTheAxes: ['', Validators.required],

      loading: [''],
      unloading: [''],
      load: ['']
    });


    
    this.form.get('vehicleType')!.valueChanges.subscribe(value => {
      if (value === 'working') {
        // Reset and clear validators before setting new ones
        this.resetLoadingFields();
        this.form.get('load')!.setValidators(Validators.required); // Ensure `load` control exists
      } else if (value === 'notWorking') {
        // Set validators for loading and unloading if vehicle is not working
        ['loading', 'unloading'].forEach(field => {
          this.form.get(field)!.setValidators(Validators.required);
          this.form.get(field)!.updateValueAndValidity();
        });
        this.form.get('load')!.clearValidators(); // Optionally clear validators for load
      } else {
        // Clear all validators and reset if no option is selected
        this.resetAllVehicleFields();
      }
      this.form.updateValueAndValidity();
    });


    if (this.form.get('vehicleType')) {
      this.form.get('vehicleType')?.valueChanges.subscribe(value => {
        if (value === 'notWorking') {
          this.form.get('loading')?.setValidators(Validators.required);
          this.form.get('unloading')?.setValidators(Validators.required);
          this.form.get('load')?.clearValidators();
        } else {
          ['loading', 'unloading', 'load'].forEach(field => {
            this.form.get(field)?.clearValidators();
            this.form.get(field)?.reset();
          });
        }
        this.form.updateValueAndValidity();
      });
    }
  
  }

  resetLoadingFields() {
    ['loading', 'unloading', 'load'].forEach(field => {
      this.form.get(field)!.clearValidators();
      this.form.get(field)!.reset();
      this.form.get(field)!.updateValueAndValidity();
    });
  }
  
   resetAllVehicleFields() {
    ['vehicleType', 'loading', 'unloading', 'load'].forEach(field => {
      this.form.get(field)!.clearValidators();
      this.form.get(field)!.reset();
      this.form.get(field)!.updateValueAndValidity();
    });
  }
  

  get otherFields(): FormGroup {
    return this.shipmentForm.get('otherFields') as FormGroup;
  }




  shipmentForm: FormGroup;

  selectedShipmentType: any; // Ensure this is initialized or handled correctly
  selectedShipmentTypeFields: any[] = [];  // Initialize as an empty array



  onShipmentTypeChange(): void {
    const typeId = this.shipmentForm.get('typeId')?.value;
    this.selectedShipmentType = this.shipmentTypes.find((type:any) => type.id === parseInt(typeId, 10));
    if (this.selectedShipmentType && this.selectedShipmentType.fields) {
      this.populateFields(this.selectedShipmentType.fields);
    } else {
      this.selectedShipmentTypeFields = [];
    }
  }
  
  

  onSubtypeChange(): void {
    const subtypeId = this.shipmentForm.get('subtypeId')?.value;
    const subtype = this.selectedShipmentType?.subtypes?.find((st:any) => st.label === subtypeId);

    if (subtype) {
      this.populateFields(subtype.fields);
    }
  }

populateFields(fields: Field[]): void {
  const fieldsGroup: any = {};
  fields.forEach(field => {
    fieldsGroup[field.field] = ['', Validators.required];
  });

  this.shipmentForm.setControl('otherFields', this.fb.group(fieldsGroup));
  this.selectedShipmentTypeFields = fields;
}

  updateFieldControls() {
    const fieldsFormGroup = this.fb.group({});
    this.selectedShipmentTypeFields.forEach(field => {
      fieldsFormGroup.addControl(field.field, this.fb.control('', Validators.required));
    });
    this.shipmentForm.setControl('otherFields', fieldsFormGroup);
    console.log("Updated fields:", this.selectedShipmentTypeFields);
  }
  
  
  // Handles setting up form controls for subtypes
  handleSubtypes(subtypes: any[]) {
    // Logic to handle subtypes, e.g., populate a dropdown
  }
  
  setupFields(fields: any[]) {
    const otherFields = this.shipmentForm.get('otherFields');
    console.log("otherFields")
    console.log(otherFields)
    if (otherFields) {
      const otherFieldsGroup = this.fb.group({});
      
      fields.forEach(field => {
        if (!otherFields.get(field.field)) {
          otherFieldsGroup.addControl(field.field, this.fb.control('', Validators.required));
        }
      });
      this.shipmentForm.setControl('otherFields', otherFieldsGroup);
     
    } else {
      console.error('otherFields group not found');
  
    }
  }
  
  
  
  // Utility function to set up field controls based on type
  setupFieldControl(field: any) {
    let validators = [Validators.required]; // Adjust validators as necessary
    switch (field.type) {
      case 'select':
      case 'radio':
        return this.fb.control(field.options[0] || '', validators);
      case 'checkbox':
        return this.fb.control(false);
      default:
        return this.fb.control('', validators);
    }
  
  }
  

  
  addShipment(): void {
    if (this.shipmentForm.invalid) {
      console.error('Form is invalid!');
      return;
    }

    const formValue = this.shipmentForm.value;
    const typeId = parseInt(formValue.typeId, 10);

    const newShipment: Shipment = {
      typeId: formValue.typeId,
      subtypeId: formValue.subtypeId,
      otherFields: formValue.otherFields
    };

    const currentShipments = this.shipmentsSubject.value.get(typeId) || [];
    currentShipments.push(newShipment);
    this.shipmentsSubject.value.set(typeId, currentShipments);
    this.shipmentsSubject.next(this.shipmentsSubject.value);
console.log(this.shipmentsSubject.value.get(typeId))
console.log(this.shipmentsSubject.value)
    this.shipmentForm.reset();
  }

  
  resetForm() {
    this.submitted = false;
    this.ShipmentFormFormSubmitted = false;
    this.shipmentForm.reset();
    this.selectedShipmentTypeFields = [];
    this.initializeForm();
  }

  deleteShipment(typeId: number, index: number) {
    const currentShipmentsMap = this.shipmentsSubject.value;
    const currentShipments = currentShipmentsMap.get(typeId) || [];
    if (index > -1 && index < currentShipments.length) {
      currentShipments.splice(index, 1);
      currentShipmentsMap.set(typeId, currentShipments);
      this.shipmentsSubject.next(currentShipmentsMap);
    }
  }

  getFieldsForType(typeId: number): Field[] {
    const type = this.shipmentTypes.find((t:any) => t.id === typeId);
    return type ? type.fields : [];
  }
  ngAfterViewInit() {
  console.log('Wizard Form:', this.wizardForm);
}


get OrderInfoFormfunc() {
  return this.orderInfoForm.controls;
}

get ShipmentFormfunc() {
  return this.ShipmentForm.controls ;
}

get Formfunc() {
  return this.form.controls ;
}


/**
 * Returns form
 */
get sendeRecipientFormFunc() {
  return this.SendeRecipientForm.controls;
}







  getObjectByIdentifierName(data: IdentifierData[], identifierName: string): IdentifierData | undefined {
      return data.find(item => item.identifierName === identifierName);
    }



ShipmentTypeValue = 3;
orders:any = [];

OrderInfoFormfuncSubmit() {
  if(this.orderInfoForm.valid) {
    this.wizardForm.goToNextStep();
  }
  this.isOrderInfoFormSubmitted = true;
}

ShipmentInfoFormfuncSubmit() {
  this.wizardForm.goToNextStep();
}



ShipmentFormfuncSubmit() {
  if(this.ShipmentForm.valid) {
    this.wizardForm.goToNextStep();
  }
  this.ShipmentFormFormSubmitted = true;
}
form2Submit() {
  if(this.SendeRecipientForm.valid) {
    this.wizardForm.goToNextStep();
  }
  this.sendeRecipientFormSubmitted = true;
}
finishFunction(){

}


onFileSelected(event: any) {
  if (event.target.files.length > 0) {
    const file: File = event.target.files[0];
    this.uploadFile(file);
  }
}
uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file, file.name);
  console.log('File uploaded successfully:', formData);

}



getShipmentTypeName(typeId: number): string {
  const type = this.shipmentTypes.find((t:any) => t.id === typeId);
  return type ? type.type : '';
}



}
