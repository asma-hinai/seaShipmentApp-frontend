import { HttpClient } from "@angular/common/http";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";

import {

  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import {PermissionsListBackendCode} from "src/app/shared/interfaces/permission.config";
import { SettingService } from "src/app/services/setting.service";
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() columns: any[];
  @Input() data: any[];
  @Input() pageSize: number;
  @Input() currentPage: number;
  @Input() actions: any;



  constructor(
    private http: HttpClient,
    public router: Router,
    private settingService: SettingService,
    private modalService: NgbModal,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
  }

  executeAction(action: any, item: any) {
    action.action(action, item);
  }

  isColumnObject(column: any): boolean {
    return typeof column === "object";
  }

  setLocalDateTime(date: any) {
    var LocalDate = new Date(date + "Z");
    return LocalDate;
  }


  getColorClass(color: any) {
    switch (color) {
      case 0:
        return "pending";
      case 1:
        return "AtPg";
      case 2:
        return "AtPg";
      case 3:
        return "AtPg";
      case 4:
        return "Successful";
      case 5:
        return "Disputed";
      default:
        return "";
    }
  }

  
 


  getPermission(code: number): string {
    return PermissionsListBackendCode[code] || "Permission not found";
  }
  


}
