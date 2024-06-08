import { Component, OnInit, Inject, Renderer2, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MENU } from './menu';
import { MenuItem } from './menu.model';
import { PermissionService } from "src/app/services/app/permission.service";
import { PermissionsList } from "src/app/shared/interfaces/permission.config";
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  menuItems: MenuItem[] = [];

  /**
  * Fixed header menu on scroll
  */
  @HostListener('window:scroll', ['$event']) getScrollHeight() {    
    if (window.matchMedia('(min-width: 992px)').matches) {
      let header: HTMLElement = document.querySelector('.horizontal-menu') as HTMLElement;
      if(window.pageYOffset >= 60) {
        header.parentElement!.classList.add('fixed-on-scroll')
      } else {
        header.parentElement!.classList.remove('fixed-on-scroll')
      }
    }
  }

  constructor(
    @Inject(DOCUMENT) private document: Document, 
    private renderer: Renderer2,
    private authService: AuthService,
    public permissionService: PermissionService,
    private router: Router
  ) { }

  ngOnInit(): void {
 
    this.setMenu();

    /**
    * closing the header menu after route change in tablet/mobile devices
    */
    if (window.matchMedia('(max-width: 991px)').matches) {
      this.router.events.forEach((event) => {
        if (event instanceof NavigationEnd) {
          document.querySelector('.horizontal-menu .bottom-navbar')!.classList.remove('header-toggled');
        }
      });
    }
  }

  async setMenu(){
    this.menuItems  = [
      {
        label: 'الرئيسية',
        icon: 'home',
        link: '/dashboard',
       view:true
      },
      {
        label: 'الطلبات',
        icon: 'archive',
        link: '/orders',
        view: await this.permissionService.checkPermission(
          PermissionsList.order_view
        ),
      },
      {
        label: 'المهام',
        icon: 'truck',
        link: '/shipments',
        view: await this.permissionService.checkPermission(
          PermissionsList.Shipments_view
        ),
      },
      {
        label: 'التقارير',
        icon: 'bar-chart-2',
        link: '/reports',
        view:true
      },
    ];
  }

  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item: MenuItem) {
    return item.subMenus !== undefined ? item.subMenus.length > 0 : false;
  }

  /**
   * Logout
   */
  onLogout(e: Event) {
    e.preventDefault();
    const deleteAllCookies = () => {
      const cookies = document.cookie.split(";");
  
      for (let cookie of cookies) {
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      }
  };
  deleteAllCookies();
  localStorage.clear();
  this.router.navigateByUrl("auth/login");
  
    this.authService.logout().subscribe(
      (res: any) => {
        this.router.navigateByUrl("auth/login");
      },
      (err) => {
      }
    );
  
  }
  

  /**
   * Toggle header menu in tablet/mobile devices
   */
  toggleHeaderMenu() {
    document.querySelector('.horizontal-menu .bottom-navbar')!.classList.toggle('header-toggled');
  }

}
