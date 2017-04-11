import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SteveBotComponent } from './steve-bot.component';

describe('SteveBotComponent', () => {
  let component: SteveBotComponent;
  let fixture: ComponentFixture<SteveBotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SteveBotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SteveBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
