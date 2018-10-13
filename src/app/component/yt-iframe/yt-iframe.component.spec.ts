import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YtIframeComponent } from './yt-iframe.component';

describe('YtIframeComponent', () => {
  let component: YtIframeComponent;
  let fixture: ComponentFixture<YtIframeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YtIframeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YtIframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
