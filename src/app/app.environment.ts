import { Injectable } from '@angular/core';
import { User } from './../models/user';
 
@Injectable()
export class GlobalVars {
  
  check: any;
  init: boolean = true;
  initLoading: any;  
  repo: string;
  user: User;

  constructor() {
    this.user = new User();
  }
}

export function dynamicSort(property) {
  var sortOrder = 1;
  if(property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a,b) {
    let firstElement = a[property];
    let secondElement = b[property];

    var result = (firstElement < secondElement) ? -1 : (firstElement > secondElement) ? 1 : 0;
    return result * sortOrder;
  }
}