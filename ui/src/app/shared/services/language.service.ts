import {inject, Injectable} from '@angular/core';
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {ReplaySubject, Subject, take} from "rxjs";

export interface Language {
    lang: string;
    text: string;
    icon: string;
    default: boolean;
}

export const LANGUAGES: Array<Language> = [
    {
        lang: 'en',
        text: 'English',
        icon: '',
        default: true
    },
    {
        lang: 'zh-tw',
        text: '繁體中文',
        icon: '',
        default: false
    },
    {
        lang: 'jp',
        text: '日本語',
        icon: '',
        default: false
    }
];

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    private translateService: TranslateService = inject(TranslateService);
    private language$: ReplaySubject<LangChangeEvent> = new ReplaySubject<LangChangeEvent>(1);

    constructor() {
    }

    // 初始化i18n
    public setInitState(): void {
        const browserLang = (this.translateService.getBrowserLang()?.includes('zh')) ? 'zh-tw' : 'en';
        const languages = [];
        for (let item of LANGUAGES) {
            languages.push(item.lang);
        }
        this.translateService.addLangs(languages);
        this.setLang(browserLang);
    }

    // 設定語言
    public setLang(lang: string) {
        this.translateService.onLangChange.pipe(take(1)).subscribe(result => {
            this.language$.next(result);
        });
        this.translateService.use(lang);
    }

    // 在ts裡取得i18n
    public lang(key: string, param?: any): string {
        if (!key) {
            return '';
        }
        const res: string = this.translateService.instant(key, param);
        if (!res) {
            return key;
        }
        return res;
    }

    // 訂閱語言變化
    public getSubject(): Subject<LangChangeEvent> {
        return this.language$;
    }
}
