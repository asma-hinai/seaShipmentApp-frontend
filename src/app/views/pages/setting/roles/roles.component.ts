import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  fillJustifyNavCode: any;
  simpleItems: any = [];
  selectedSimpleItem: any = null;
 

  ngOnInit(): void {
    this.simpleItems = [true, 'Two', 3];
  }
  constructor(private modalService: NgbModal) { }


  openLgModal(content: TemplateRef<any>) {
    this.modalService.open(content, {size: 'lg'}).result.then((result) => {
      console.log("Modal closed" + result);
    }).catch((res) => {});
  }


}
