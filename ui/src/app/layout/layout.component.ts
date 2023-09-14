import { Component } from '@angular/core';
import {LayoutService} from "./services/layout.service";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  public isSmallerScreen = this.layoutService.isSmallerScreen;
  constructor(
      private layoutService: LayoutService
  ) {
  }
}
