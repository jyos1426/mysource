import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter
} from '@angular/core';

import { Helpers } from './../../../../../../helpers';

import { Http, Response } from '@angular/http';
import { UserService } from '../_services/user.service';

import * as crypto from 'crypto-js';

interface Item {
  text: string;
  value: number;
}

@Component({
  selector: 'app-add-user-sidebar',
  templateUrl: './add-user-sidebar.component.html',
  encapsulation: ViewEncapsulation.None
})

export class AddUserSidebarComponent implements OnInit, AfterViewInit {
  @ViewChild('btnAddSidebarCancel') btnAddSidebarCancel : ElementRef;
  @Output() addComplete = new EventEmitter();

  @ViewChild('inputId') inputId : ElementRef;
  @ViewChild('inputPassword1') inputPassword1 : ElementRef;
  @ViewChild('inputEmail') inputEmail : ElementRef;
  @ViewChild('inputPhone') inputPhone : ElementRef;
  @ViewChild('inputPasswordLimit') inputPasswordLimit : ElementRef;
     
  id : string = "";
  password1 : string = "";
  password2 : string = "";
  email : string = "";
  passwordLimit : number = 1;
  phone : string = "";
  extension : string = "";
    
  verifyAlert : boolean = false;
  verifyText : string = "";

  emailVerified : boolean = false;

  authListItems : Array<Item>;
  authListData: Array<Item> = [
    { value: 1, text: '전체관리자' },
    { value: 2, text: '일반관리자' }
  ];
  selectedAuthMode: Item;
  
  constructor(
    private _userService : UserService, 
    private http: Http) {
      
  }
  
  phoneMask() {
      let numbers = this.phone.match(/\d/g);
      let numberLength = 0;
      if (numbers) {
        numberLength = numbers.join("").length;
      }

      if (numberLength < 10) {
        return [/[0-9]/,/[0-9]/,/[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];   
      } else {
        return [/[0-9]/, /[0-9]/,/[0-9]/, '-',/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
      }
  } 
  ngOnInit() {
  }

  ngAfterViewInit() {
  }
  
  initForm(){
    this.id = "";    
    this.password1 = "";
    this.password2 = "";
    this.email = "";
    this.passwordLimit = 1;
    this.phone = "";
    this.extension = "";
    this.verifyAlert = false;
    this.emailVerified = false;
    
    this.authListItems = this.authListData;
    this.selectedAuthMode = this.authListItems[1];
  }

  // public changeAuthMode(item: Item) {
  //   this.selectedAuthMode = item;
  // }


  changeEmail(){
    const regexEmail = /^[_a-zA-Z0-9-\.]+@[\.a-zA-Z0-9-]+\.[a-zA-Z]+$/;
     
    if( regexEmail.test(this.email) ){
      this.emailVerified = true;
    }else{
      this.emailVerified = false;
    }
  }

  clickAddUser(){        
    const idRegEx = /^[a-zA-Z0-9]{5,9}$/;             
    const passwordRegEx = /^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z]).{8,12}$/;
    const emailRegEx = /^[_a-zA-Z0-9-\.]+@[\.a-zA-Z0-9-]+\.[a-zA-Z]+$/;
    const phoneRegEx = /^\d{3}-\d{3,4}-\d{4}$/;

    if (!idRegEx.test(this.id)) {   
        this.verifyAlert = true;
        this.verifyText = "아이디의 형식이 올바르지 않습니다."; 
        this.inputId.nativeElement.focus(); 

    } else if (!passwordRegEx.test(this.password1)) {   
      this.verifyAlert = true;
      this.verifyText = "비밀번호의 형식이 올바르지 않습니다.";   
      this.inputPassword1.nativeElement.focus();  

    } else if(this.password1 != this.password2){
      this.verifyAlert = true;
      this.verifyText = "비밀번호가 일치하지 않습니다.";   
      this.inputPassword1.nativeElement.focus(); 

    } else if(this.email.length > 0 && !emailRegEx.test(this.email) ) {   
      this.verifyAlert = true;
      this.verifyText = "메일의 형식이 올바르지 않습니다.";  
      this.inputEmail.nativeElement.focus(); 

    } else if(this.phone.length > 0 && !phoneRegEx.test(this.phone) ) {   
      this.verifyAlert = true;
      this.verifyText = "전화번호의 형식이 올바르지 않습니다.";  
      this.inputPhone.nativeElement.focus(); 

    }else if(this.passwordLimit == null) {   
      this.verifyAlert = true;
      this.verifyText = "유효기간이 입력되지 않았습니다.";   
      this.inputPasswordLimit.nativeElement.focus(); 
    
    } else{
      this.verifyAlert = false;      
      let hashPassword = crypto.SHA256(this.id + this.password1).toString();
      
      let params = {
          id : this.id,
          password : hashPassword,
          authority : this.selectedAuthMode.value,
          password_limit : this.passwordLimit
        };
        
      if(this.email.length > 0){
        params["email"] = this.email;
      }
      if(this.phone.length > 0){
        params["phone"] = this.phone;
      }
      if(this.extension.length > 0){
        params["extension"] = this.extension;
      }

      // let params = {
      //   id : this.id,
      //   password : hashPassword,
      //   email : this.email,    
      //   authority : 2,  
      //   password_limit : this.passwordLimit,
      //   phone : this.phone,
      //   extension : this.extension      
      // }
     
      this._userService.insertUserData(params).subscribe(
        data => {
          if ( data.message === "success") {
            this.addComplete.emit();      
            this.btnAddSidebarCancel.nativeElement.click();  
          } else {
          }
        },
        error => {
          this.verifyAlert = true;
          this.verifyText = JSON.parse(error._body)["detail"];   
          console.log(error._body);
        }
      );
      
    }
  }
}
