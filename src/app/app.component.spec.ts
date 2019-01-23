import { TestBed, async } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { Routing } from './app.routing';
import { AppComponent } from './app.component';
import { TopBarComponent } from './component/top-bar/top-bar.component';
import { BackgroundComponent } from './component/background/background.component';
import { ButtonComponent } from './component/form/button/button.component';
import { InputComponent } from './component/form/input/input.component';
import { AuthenticatedComponent } from './component/authenticated/authenticated.component';
import { ResultComponent } from './component/result/result.component';
import { HomeComponent } from './component/home/home.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        TopBarComponent,
        BackgroundComponent,
        ButtonComponent,
        InputComponent,
        AuthenticatedComponent,
        ResultComponent,
        HomeComponent,
      ],
      imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        Routing
      ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  /* it(`should have as title 'mycoolplaylist'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('mycoolplaylist');
  }));*/
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('app-background').innerHtml).toContain('<app-top-bar>');
    expect(compiled.querySelector('app-background').innerHtml).toContain('<router-outlet>');
  }));
});
