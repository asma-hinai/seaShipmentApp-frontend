import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  fillJustifyNavCode: any;
  simpleItems: any = [];
  selectedSimpleItem: any = null;
 

  ngOnInit(): void {
   
  }
  constructor(private modalService: NgbModal) { }


  openLgModal(content: TemplateRef<any>) {
    this.modalService.open(content, {size: 'lg'}).result.then((result) => {
      console.log("Modal closed" + result);
    }).catch((res) => {});
  }

  

}
