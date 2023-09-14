import { Component } from '@angular/core';
import {MENU_ITEMS} from "../../pages/page-menu";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  public menuItems = MENU_ITEMS;

}
