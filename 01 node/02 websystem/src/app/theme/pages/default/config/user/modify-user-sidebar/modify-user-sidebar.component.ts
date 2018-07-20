import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,  
  ElementRef,
  Output,
  EventEmitter
} from '@angular/core';

import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl
} from '@angular/forms';

import { GridDataResult } from '@progress/kendo-angular-grid';

import { Helpers } from './../../../../../../helpers';

import { Http, Response } from '@angular/http';
import { UserService } from '../_services/user.service';

import * as crypto from 'crypto-js';

interface Item {
  text: string;
  value: number;
}

@Component({
  selector: 'app-modify-user-sidebar',
  templateUrl: './modify-user-sidebar.component.html',
  encapsulation: ViewEncapsulation.None
})

export class ModifyUserSidebarComponent implements OnInit{
  @ViewChild('btnModifySidebarCancel') btnModifySidebarCancel : ElementRef;

  @ViewChild('inputIP') inputIP : ElementRef;
  @ViewChild('inputEmail') inputEmail : ElementRef;
  @ViewChild('inputPhone') inputPhone : ElementRef;
  @ViewChild('inputPasswordLimit') inputPasswordLimit : ElementRef;
  @ViewChild('inputPassword1') inputPassword1 : ElementRef;

  @Output() modifyComplete = new EventEmitter();

  hidePasswordComponent : boolean = true;
  hideModifyUserComponent : boolean = true;
  
  checkPassword : string = "";

  id : string = "";
  email : string = "";
  limitDate : number = 0;
  autority : number = 0;
  passwordLimit : number = 0;
  phone : string = "";
  extension : string = "";
  accessIp : string = "";
  accessIpVerified : boolean = false;
  emailVerified : boolean = true;
  
  password1 : string = "";
  password2 : string = "";

  passCheckAlert : boolean = false;
  passCheckText : string = "";
  
  verifyAlert : boolean = false;
  verifyText : string = "";

  accessIpGridView: GridDataResult;
  public accessIpGridData: Array<any>;
  public accessIpList: Array<any>;

  authListItems : Array<Item>;
  authListData : Array<Item> = [
    { value: 1, text: '전체관리자' },
    { value: 2, text: '일반관리자' }
  ];
  selectedAuthMode: Item;


  constructor(
    private _userService : UserService, 
    private http: Http) {

    this.hidePasswordComponent = false;
    this.hideModifyUserComponent = true;
  }
  
  ngOnInit() {

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

  initForm(id : string){
    if (id == "" || id == undefined)
      this.id = "";
    else 
      this.id = id;
    
    this.checkPassword = "";
    this.email = "";
    this.passwordLimit = 0;
    this.phone = "";
    this.extension = "";
    this.autority = 0;
    this.limitDate = 0;
    
    this.password1 = "";
    this.password2 = "";
    
    this.accessIp = "";

    this.hidePasswordComponent = false;
    this.hideModifyUserComponent = true;
    this.passCheckAlert = false;
    this.verifyAlert = false;
    this.accessIpVerified = false;
    this.emailVerified = true;    
    
    this.authListItems = this.authListData;
    this.selectedAuthMode = this.authListItems[0];
  
  }

  checkPasswordClick(){    
    const params = {
      id : this.id,
      password : this.checkPassword
    };

    this._userService.checkPassword(params).subscribe(
      data => {
        console.log(data);
        if (typeof data === 'undefined') {
          this.passCheckAlert = true;
          this.passCheckText = "비밀번호를 확인하는데 문제가 발생하였습니다.";

        } else if(data.message == "success"){   
          this.getUserInfoData();  
          this.getUserAccessIp();
        }
      },
      error => {
        if(error.code="011"){
          this.passCheckText = "비밀번호가 틀렸습니다.";
        }else if(error.code="008"){
          this.passCheckText = "세션이 끊겼습니다.";
        }else{
          this.passCheckText = error.message;
        }
        this.passCheckAlert = true;
      }
    );
    
  }
  
  getUserInfoData(){
    const params = {
      id : this.id,
    };
    this._userService.getUserData(params).subscribe(
      data => {
        console.log(data);
        if (typeof data === 'undefined') {
          console.log('data : undefined');
        } else {
          var result = data.datas[0];
          this.id = result.id;
          this.email = result.email;
          this.passwordLimit = parseInt(result.password_limit);
          this.phone = result.phone;
          this.extension = result.extension;
          this.selectedAuthMode = this.authListItems[parseInt(result.authority)-1];
          
          this.hidePasswordComponent = true;
          this.hideModifyUserComponent = false;
        }
      },
      error => {
        console.log('data : undefined');
      }
    );
  }
  
  changeEmail(){
    //정규식을 변경해야만 할 것 같음...
    const regexEmail = /^[_a-zA-Z0-9-\.]+@[\.a-zA-Z0-9-]+\.[a-zA-Z]+$/;
     
    if( regexEmail.test(this.email) ){
      this.emailVerified = true;
    }else{
      this.emailVerified = false;
    }
  }

  getUserAccessIp(){
    const params = {
      id : this.id,
    };
    this._userService.getUserAccessIp(params).subscribe(
      data => {
        console.log(data);
        if (typeof data === 'undefined') {
          this.accessIpGridData = [];
        } else {
          this.accessIpList = data.datas[0].access_address;
          this.parseAccessIpGridData(this.accessIpList);
          this.loadAccessIpItems();
        }
      },
      error => {
        this.accessIpGridData = [];
      }
    );
  }
  
  parseAccessIpGridData(jsonData: any[]) {
    const tempGridData: any[] = [];

    jsonData.forEach((row, idx) => {
      tempGridData.push({
        ip: row
      });
    });
    this.accessIpGridData = tempGridData;
  }
  
  private loadAccessIpItems(): void {
    this.accessIpGridView = {
      data: this.accessIpGridData,
      total: this.accessIpGridData.length
    };
  }

  changeAccessIp(){
    //정규식을 변경해야만 할 것 같음...
    const regexIPv4 = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const regexIPv6 = /^((?:[1-9])|(?:[1-9][0-9])|(?:1[0-2][0-9])|(?:12[0-8]))$/;
     
    if( regexIPv4.test(this.accessIp) || regexIPv6.test(this.accessIp) ){
      this.accessIpVerified = true;
    }else{
      this.accessIpVerified = false;
    }
  }

  addUserAccessIp(){
    let ipDuplicated : boolean = false;

    if(this.accessIp != ""){
      //리스트에 있는지 확인
      for(var i=0 ; i< this.accessIpList.length; i++) {
        if ( this.accessIp == this.accessIpList[i]){
          ipDuplicated = true;
          break;
        }
      }

      if( !ipDuplicated ){   
        let param = {
          id : this.id, 
          access_address : [this.accessIp]
        }
        this._userService.insertUserAccessIp(param).subscribe(
          data => {
            if ( data.message === "success") {
              this.getUserAccessIp();
              this.modifyComplete.emit();
              this.accessIp="";
            } else {
            }
          },
          error => {
            console.log(error);
          }
        );
      }else{
        this.verifyAlert = true;
        this.verifyText = "중복된 IP가 존재합니다.";  
        this.inputIP.nativeElement.focus(); 
      }

    }
  }

  deleteUserAccessIp(selectedIp){    
      let param = {
        id : this.id,
        access_address : [selectedIp]
      }
      this._userService.deleteUserAccessIp(param).subscribe(
        data => {
          console.log(data);
          if ( data.message === "success") {
            this.getUserAccessIp();
            this.modifyComplete.emit();
            this.accessIp="";
          } else {
          }
        },
        error => {
          console.log(error);
        }
      );
  }

  gridSelectionChanged(accessIpGrid, selection){
    // const selectedData = accessIpGrid.data.data[selection.index]);
    const selectedData = selection.selectedRows[0].dataItem;
    this.accessIp = selectedData.ip;
    this.accessIpVerified = true;
    this.inputIP.nativeElement.focus();
  }

  updateData(){
    // var verifyFlag : boolean = true;
    const emailRegEx = /^[_a-zA-Z0-9-\.]+@[\.a-zA-Z0-9-]+\.[a-zA-Z]+$/;
    const passwordRegEx = /^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z]).{8,12}$/;
    const phoneRegEx = /^\d{3}-\d{3,4}-\d{4}$/;
            
    if (this.password1.length > 0 && !passwordRegEx.test(this.password1)) {   
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
    
    } else if(this.passwordLimit == null) {   
      this.verifyAlert = true;
      this.verifyText = "유효기간이 입력되지 않았습니다.";  
      this.inputPasswordLimit.nativeElement.focus(); 
    
    } else{
      this.verifyAlert = false;
      let hashPassword = undefined;

      if( this.password1.length > 0 ){
        hashPassword = crypto.SHA256(this.id + this.password1).toString();
      }   
      
      let params = {
        id : this.id,
        password : hashPassword,
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

      this._userService.updateUserData(params).subscribe(
        data => {
          if ( data.message === "success") {
            this.modifyComplete.emit();
            this.btnModifySidebarCancel.nativeElement.click();  
          } else {
          }
        },
        error => {
          console.log(error);
          this.verifyAlert = true;
          this.verifyText = error._body["detail"];   
        }
      );

    }
  }

  handleKeyDown(event,mode){    
    if (event.keyCode === 13) {

      if(mode == 'PASSWORD_CHECK'){
        this.checkPasswordClick();
      }else if(mode == 'ACCESS_IP_ADD'){
        this.addUserAccessIp();
      }

    }
  }

}
