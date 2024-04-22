import { HttpClient } from "@angular/common/http";
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";

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
    public router: Router
  ) {}

  ngOnInit(): void {
  }

  executeAction(action: any, item: any) {
    action.action(item, item.type);
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
  

}
