import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { Routing } from './app.routing';

import { AppComponent } from './app.component';

import { WindowRefService } from './service/window/window-ref.service';
import { HomeComponent } from './component/home/home.component';
import { AuthenticatedComponent } from './component/authenticated/authenticated.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthenticatedComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    Routing
  ],
  providers: [WindowRefService],
  bootstrap: [AppComponent]
})
export class AppModule { }
