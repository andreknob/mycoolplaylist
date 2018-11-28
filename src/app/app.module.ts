import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { Routing } from './app.routing';

import { AppComponent } from './app.component';

import { WindowRefService } from './service/window/window-ref.service';
import { UserService } from './service/user/user.service';
import { ResultService } from './service/result/result.service';

import { HomeComponent } from './component/home/home.component';
import { AuthenticatedComponent } from './component/authenticated/authenticated.component';
import { InputComponent } from './component/form/input/input.component';
import { ButtonComponent } from './component/form/button/button.component';
import { AutoCompleteComponent } from './component/form/auto-complete/auto-complete.component';
import { ResultComponent } from './component/result/result.component';
import { BackgroundComponent } from './component/background/background.component';
import { TopBarComponent } from './component/top-bar/top-bar.component';
import { SectionComponent } from './component/section/section.component';
import { RadioButtonComponent } from './component/form/radio-button/radio-button.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthenticatedComponent,
    InputComponent,
    ButtonComponent,
    AutoCompleteComponent,
    ResultComponent,
    BackgroundComponent,
    TopBarComponent,
    SectionComponent,
    RadioButtonComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    Routing
  ],
  providers: [WindowRefService, UserService, ResultService],
  bootstrap: [AppComponent]
})
export class AppModule { }
