import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

interface ToastParam {
  title?: string;
  text?: string;
  toast?: boolean;
  icon?: ToastIcon;
  backdrop?: boolean;
  position?: ToastPosition;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  timer?: number;
  timerProgressBar?: boolean;
}

type ToastIcon = 'warning'
    | 'error'
    | 'success'
    | 'info'
    | 'question'

type ToastPosition = 'top'
    | 'top-start'
    | 'top-end'
    | 'center'
    | 'center-start'
    | 'center-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor() { }

  private showMessage(type: 'success' | 'info' | 'warning' | 'error' | 'question', params: ToastParam) {
    if (type ==='question') {
      return Swal.fire(params);
    } else {
      Swal.fire(params);
    }
    return;
  }

  public showSuccess(params: {title: string, text?: string}){
    const options: ToastParam = {
      title: params.title,
      text: params.text,
      toast: true,
      icon: 'success',
      position: 'top-end',
      showConfirmButton: false,
      showCancelButton: false,
      timer: 3000,
      timerProgressBar: true,
    }
    this.showMessage('success', options);
  }

  public showInfo(params: {title: string, text?: string}){
    const options: ToastParam = {
      title: params.title,
      text: params.text,
      toast: true,
      icon: 'info',
      position: 'top-end',
      showConfirmButton: false,
      showCancelButton: false,
      timer: 3000,
      timerProgressBar: true,
    }
    this.showMessage('info', options);
  }

  public showWarning(params: {title: string, text?: string}){
    const options: ToastParam = {
      title: params.title,
      text: params.text,
      toast: true,
      icon: 'warning',
      position: 'top-end',
      showConfirmButton: false,
      showCancelButton: false,
      timer: 3000,
      timerProgressBar: true,
    }
    this.showMessage('warning', options);
  }

  public showError(params: {title: string, text?: string}){
    const options: ToastParam = {
      title: params.title,
      text: params.text,
      toast: true,
      icon: 'error',
      position: 'top-end',
      showConfirmButton: false,
      showCancelButton: false,
      timer: 3000,
      timerProgressBar: true,
    }
    this.showMessage('error', options);
  }

  public showQuestion(params: {title: string, text?: string}){
    const options: ToastParam = {
      title: params.title,
      text: params.text,
      icon: 'question',
      backdrop: true,
      position: 'center',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: '確定',
      cancelButtonText: '取消',
    }
    return this.showMessage('question', options);
  }
}
