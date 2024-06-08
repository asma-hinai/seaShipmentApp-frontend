import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { Router, ActivatedRoute } from "@angular/router";
import { SettingService } from "src/app/services/setting.service";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";


@Component({
  selector: 'app-identifiers',
  templateUrl: './identifiers.component.html',
  styleUrls: ['./identifiers.component.scss']
})
export class IdentifiersComponent implements OnInit {
  identifierId: any;
  identifierName: any;
  isLoading = false;
   currentPage: any = 1;
  pageSize: any = 10;
  IdentifiersData:any = [];
  @ViewChild('lgModal') lgModal: TemplateRef<any>;
  private modalRef: NgbModalRef;
  form!: FormGroup;
  constructor(
    private modalService: NgbModal,
    private settingService: SettingService,
    private fb: FormBuilder,
 
  ) {}


  ngOnInit(): void {
    this.getIdentifiers();
    this.initForm();
  }

  tableColumns = [
    {
      header: "اسم المعرف",
      field: "identifierName",
      type: "text",
      functionObject: null,
    },
    {
      header: "النوع",
      field: "identifierValues",
      type: "identifierValues",
      functionObject: [
        {
          label: "deleteIdentifier",
         action: (action: any, data: any) => this.deleteIdentifierValues(action, data),
        },
       
      ],
    },
    {
      header: "الإجراء",
      field: "actions",
      type: "function",
      functionObject: [
        {
          label: "add",
          action: (action: any, data: any) => this.openLgModal(action, data),
        },
      
      ],
    },
  

  ];

  date =[{
    "name" : " أوزان الآلـيــات",
    "type" : ["نوع الشحنة ٢", "نوع الشحنة ١" ]
  },
  {
    "name" : "الجهات",
    "type" : [
      "وزن الشحنة ٢", "وزن الشحنة ١" ]
  },
  {
    "name" : " أوزان الشحن",
    "type" : ["الجهة ٢", "الجهة ١" ]
  }
, {
  "name" : "  المواني",
  "type" : ["الجهة ٢", "الجهة ١" ]
}
, {
  "name" : "تكلفة الكيلو",
  "type" : ["الجهة ٢", "الجهة ١" ]
}
]
 




  getIdentifiers() {
    this.isLoading = true;
    this.settingService.getIdentifiers().subscribe(
      async (res: any) => {
        this.isLoading = false;
        this.IdentifiersData =res.data
      },
      (err: { error: { code: number } }) => {
        this.isLoading = false;
      }
    );
  }

  deleteIdentifierValues(action:any , data:any){
      Swal.fire({
        title: "هل أنت متأكد ؟",
        text: data.value + " حذف بيانات هذا المعرف  ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "نعم",
        cancelButtonText: "لا",
      }).then((result) => {
        this.settingService.deleteIdentifiers(data.id).subscribe(
          (res: any) => {
         
            this.getIdentifiers();
          }, err => {
          }
        );

        if (result.isConfirmed) {
          Swal.fire({
            title: " ممتاز!",
            text: "تم حذف هذا المعرف",
            icon: "success",
          });
        }
      });

  }




  addIdentifierValues(data:any){
    console.log(data.identifierId)
  }
  
  
  openLgModal(action:any, data:any){
    this.identifierId = data.identifierId;
    this.identifierName = data.identifierName;
    this.modalRef = this.modalService.open(this.lgModal, { size: 'lg' });
  }

  closeModal() {
    // Check if there's a modal to close
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  initForm() {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
   
    });
  }

  AddIdentifierValues(){
    let params = {
      "identifierId":  this.identifierId,
      "value": this.form.value.name,
    }

    this.settingService.addIdentifiers(params).subscribe(
      (res: any) => {
        this.closeModal() ;
        this.getIdentifiers();
     
        Swal.fire({
          timer: 3000, 
          title: "ممتاز!",
          text: "تمت إضافة مهمة جديدة بنجاح",
          icon: "success",
        });

        this.isLoading = false;
        this.form.reset();
      },
      (err) => {
        this.isLoading = false;
 

      }
    );
  }



}
