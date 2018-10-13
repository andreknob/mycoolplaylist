import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { Routing } from './app.routing';

import { AppComponent } from './app.component';

import { WindowRefService } from './service/window/window-ref.service';
import { HomeComponent } from './component/home/home.component';
import { AuthenticatedComponent } from './component/authenticated/authenticated.component';
import { InputComponent } from './component/form/input/input.component';
import { ButtonComponent } from './component/form/button/button.component';
import { AutoCompleteComponent } from './component/form/auto-complete/auto-complete.component';
import { YtIframeComponent } from './component/yt-iframe/yt-iframe.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthenticatedComponent,
    InputComponent,
    ButtonComponent,
    AutoCompleteComponent,
    YtIframeComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    Routing
  ],
  providers: [WindowRefService],
  bootstrap: [AppComponent]
})
export class AppModule { }
