import {Injectable, signal} from '@angular/core';
import {BreakpointObserver, BreakpointState} from "@angular/cdk/layout";

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  public isSmallerScreen = signal(true)

  constructor(
      private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver.observe([
        "(max-width: 992px)"
    ]).subscribe((result: BreakpointState) => {
      this.isSmallerScreen.set(result.matches)
    });
  }

}
