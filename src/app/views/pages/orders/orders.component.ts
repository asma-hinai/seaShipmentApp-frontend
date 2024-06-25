import { Component, OnInit, TemplateRef, ViewChild} from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { OrdersService } from "src/app/services/orders.service";
import { SettingService } from "src/app/services/setting.service";
import { ShipmentService } from './shipment.service';
import {  FormBuilder, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  form: FormGroup;

  
  date = null;
  status = null ;
  currentPage: any = 1;
  pageSize: any = 10;
  orderData:any = [];
  isLoading = false;
  statusData:any = [];
  hoveredDate: NgbDate | null = null;
  search ="";
  Orderid: any;
  rejectReason ="";
  fromDate: NgbDate | null = null;
  toDate: NgbDate | null = null;
  formattedFromDate: string | null = null;
  formattedToDate: string | null =null;
  orderDate: NgbDate | null = null;
  formattedOrderDate: string | null = null;



  @ViewChild('lgModal') lgModal: TemplateRef<any>;
  private modalRef: NgbModalRef;

  @ViewChild('reasonModal') reasonModal: TemplateRef<any>;
  private reasonmodalRef: NgbModalRef;


  openreasonLgModal(){
    this.reasonmodalRef = this.modalService.open(this.reasonModal, { size: 'xl' });
  }


  constructor(
    public shipmentService: ShipmentService,
    private modalService: NgbModal,
    private ordersService: OrdersService,
    public formatter: NgbDateParserFormatter,
    public settingService :SettingService,
    public formBuilder: UntypedFormBuilder,
    private fb: FormBuilder
    ) {
   
    }
  
  

    ngOnInit() {
      this.getOrderswithPagination();
 
    }


  

   
    


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


  onSearch(ev:any): void {
    this.search = ev;
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



  getOrderswithPagination() {
    let params = {
      page: this.currentPage,
      pageSize: 10,
      search:this.search,
      from:  this.formattedFromDate ,
      to:  this.formattedToDate,
      orderStatusType: this.status,
    };
    this.isLoading = true;
    this.ordersService.getOrders(params).subscribe(
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
      field: "orderCode",
      type: "text",
      functionObject: null,
    },
    {
      header: " تاريخ الطلب",
      field: "orderDate",
      type: "date",
      functionObject: null,
    },
    {
      header: "حالة الطلب",
      field: "orderStatus",
      type: "text",
      functionObject: null,
    },
    {
      header: "رقم المهمة",
      field: "missionCode",
      type: "text",
      functionObject: null,
    },
  
    {
      header: "حالة المهمة",
      field: "missionStatus",
      type: "text",
      functionObject: null,
    },
    {
      header: "الجهة الطالبة",
      field: "requesterEntity",
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







  editOrder(action:any , data:any){

  }


  acceptOrder(action:any , data:any){
  let params =  {
      type : 2,
      reason: "string"
    }
    Swal.fire({
      title: "هل أنت متأكد",
      text: "أنك تريد قبول هذا الطلب؟",
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
      text: "أنك تريد رفض هذا الطلب؟",
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
          text: "تم رفض هذا الطلب بنجاح",
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






  onChange(result: Date): void {
    console.log('onChange: ', result);
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

}
