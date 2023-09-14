import {inject, Injectable, TemplateRef} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {
    private snackbar = inject(MatSnackBar);
    public get snackbarRef() {
        return this.snackbar._openedSnackBarRef;
    }
    public snackbarSuccessConfig: MatSnackBarConfig = {
        panelClass: ['snackbar-success'],
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
    }
    public snackbarErrorConfig: MatSnackBarConfig = {
        panelClass: ['snackbar-error'],
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
    }


    constructor() {
    }

    public open(label: string, action?: string, config?: MatSnackBarConfig) {
        this.snackbar.open(label, action, config)
    }

    public openFromTemplate(template: TemplateRef<any>, config: MatSnackBarConfig) {
        this.snackbar.openFromTemplate(template, config);
    }
}
