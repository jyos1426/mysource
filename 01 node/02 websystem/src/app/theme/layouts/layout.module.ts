import { NgModule } from '@angular/core';
import { LayoutComponent } from './layout/layout.component';
import { HeaderNavComponent } from './header-nav/header-nav.component';
import { DefaultComponent } from '../pages/default/default.component';
import { AsideNavComponent } from './aside-nav/aside-nav.component';
import { FooterComponent } from './footer/footer.component';
import { QuickSidebarComponent } from './quick-sidebar/quick-sidebar.component';
import { ScrollTopComponent } from './scroll-top/scroll-top.component';
import { TooltipsComponent } from './tooltips/tooltips.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HrefPreventDefaultDirective } from '../../_directives/href-prevent-default.directive';
import { UnwrapTagDirective } from '../../_directives/unwrap-tag.directive';

import { SessionTimeoutComponent } from './session-timeout/session-timeout.component';

import { AvatarModule } from 'ngx-avatar';
import { HttpApiService } from '../../_services/http-api.service';

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderNavComponent,
    DefaultComponent,
    AsideNavComponent,
    FooterComponent,
    QuickSidebarComponent,
    ScrollTopComponent,
    TooltipsComponent,
    SessionTimeoutComponent,
    HrefPreventDefaultDirective,
    UnwrapTagDirective,
  ],
  exports: [
    LayoutComponent,
    HeaderNavComponent,
    DefaultComponent,
    AsideNavComponent,
    FooterComponent,
    QuickSidebarComponent,
    ScrollTopComponent,
    TooltipsComponent,
    SessionTimeoutComponent,
    HrefPreventDefaultDirective,
  ],
  imports: [
    CommonModule,
    RouterModule,
    AvatarModule
  ],
  providers: [
    HttpApiService
  ]
})
export class LayoutModule {
}
