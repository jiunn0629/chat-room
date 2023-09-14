import {APP_INITIALIZER, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppService} from "./services/app.service";
import {firstValueFrom} from "rxjs";



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (config: AppService) => {
        return () => {

        }
      },
    }
  ]
})
export class CoreModule { }
