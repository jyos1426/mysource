
import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScriptLoaderService } from '../_services/script-loader.service';
import { AuthenticationService } from './_services/authentication.service';
import { AlertService } from './_services/alert.service';
import { UserService } from './_services/user.service';
import { AlertComponent } from './_directives/alert.component';
import { LoginCustom } from './_helpers/login-custom';
import { Helpers } from '../helpers';

import * as crypto from 'crypto-js';

@Component({
  selector: '.m-grid.m-grid--hor.m-grid--root.m-page',
  templateUrl: './templates/login-swf.component.html',
  encapsulation: ViewEncapsulation.None
})

export class AuthComponent implements OnInit {
  model: any = {};
  loading = false;
  returnUrl: string;

  @ViewChild('alertSignin', { read: ViewContainerRef }) alertSignin: ViewContainerRef;
  @ViewChild('alertSignup', { read: ViewContainerRef }) alertSignup: ViewContainerRef;
  @ViewChild('alertForgotPass', { read: ViewContainerRef }) alertForgotPass: ViewContainerRef;

  constructor(private _router: Router,
    private _script: ScriptLoaderService,
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _authService: AuthenticationService,
    private _alertService: AlertService,
    private cfr: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.model.remember = true;
    // get return url from route parameters or default to '/'
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
    this._router.navigate([this.returnUrl]);

    this._script.load('body', 'assets/vendors/base/vendors.bundle.js', 'assets/demo/default/base/scripts.bundle.js')
      .then(() => {
        Helpers.setLoading(false);
        LoginCustom.init();
      });
  }

  errorEvent(message: string, status: boolean) {
    this.showAlert('alertSignin');
    this._alertService.error(message);
    this.loading = status;
  }

  signin() {
    let id = this.model.userid;
    let pw = crypto.SHA256(id + this.model.password);
    let r1 = crypto.SHA256((Math.round(Math.random() * 2767531574) / Math.random()).toString()).toString();

    this.loading = true;
    this._authService.login1(id, r1)
      .subscribe(
      data => {
        if (typeof data.error === 'undefined') {
          let r2 = data.success.r2;
          let res2 = crypto.SHA256(id + pw).toString();
          res2 = crypto.SHA256(r1 + r2 + res2).toString();

          this._authService.login2(this.model.userid, res2)
            .subscribe(
            data => {
              if (typeof data.error === 'undefined') {
                this._router.navigate([this.returnUrl]);
              } else {
                this.errorEvent(data.error.msg, false);
              }
            },
            error => {
              this.errorEvent(error, false);
            }
            );
        } else {
          this.errorEvent(data.error.msg, false);
        }
      },
      error => {
        this.errorEvent(error, false);
      }
      );
  }

  //     signup() {
  //         this.loading = true;
  //         this._userService.create(this.model)
  //             .subscribe(
  //             data => {
  //                 this.showAlert('alertSignin');
  //                 this._alertService.success('Thank you. To complete your registration please check your email.', true);
  //                 this.loading = false;
  //                 LoginCustom.displaySignInForm();
  //                 this.model = {};
  //             },
  //             error => {
  //                 this.showAlert('alertSignup');
  //                 this._alertService.error(error);
  //                 this.loading = false;
  //             });
  //     }

  //     forgotPass() {
  //         this.loading = true;
  //         this._userService.forgotPassword(this.model.email)
  //             .subscribe(
  //             data => {
  //                 this.showAlert('alertSignin');
  //                 this._alertService.success('Cool! Password recovery instruction has been sent to your email.', true);
  //                 this.loading = false;
  //                 LoginCustom.displaySignInForm();
  //                 this.model = {};
  //             },
  //             error => {
  //                 this.showAlert('alertForgotPass');
  //                 this._alertService.error(error);
  //                 this.loading = false;
  //             });
  //     }

  showAlert(target) {
    this[target].clear();
    let factory = this.cfr.resolveComponentFactory(AlertComponent);
    let ref = this[target].createComponent(factory);
    ref.changeDetectorRef.detectChanges();
  }
}
