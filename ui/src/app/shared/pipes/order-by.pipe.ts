import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy',
  pure: false
})
export class OrderByPipe implements PipeTransform {

  transform<T>(value: T[] | null, key: keyof T): T[] | undefined {
    if (value === null){
      return;
    }
    if (!value || !value.length || !key) {
      return value;
    }

    const sortedArray = value.slice().sort((a,b) => {
      const aValue = a[key];
      const bValue = b[key];
      if (aValue < bValue) {
        return 1
      } else {
        return -1
      }
    });
    return sortedArray;
  }

}
