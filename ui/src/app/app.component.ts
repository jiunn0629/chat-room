import {Component, inject, OnInit} from '@angular/core';
import {LanguageService} from "./shared/services/language.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    private languageService = inject(LanguageService);
    title = 'chat-ui';
    ngOnInit() {
        this.languageService.setInitState();
    }
}
