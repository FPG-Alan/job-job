/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NewJobComponent } from './new-job.component';
import {FormsModule} from "@angular/forms";

describe('NewJobComponent', () => {
  let component: NewJobComponent;
  let fixture: ComponentFixture<NewJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ NewJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should split words on name change", () =>{
      fixture = TestBed.createComponent(NewJobComponent);
      let app = fixture.debugElement.componentInstance;
      expect(app.testOnJobNameChange("What a test name")).toEqual("What_A_Test_Name");
  })
});
