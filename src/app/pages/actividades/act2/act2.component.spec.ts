import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Act2Component } from './act2.component';

describe('Act2Component', () => {
  let component: Act2Component;
  let fixture: ComponentFixture<Act2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Act2Component]
    });
    fixture = TestBed.createComponent(Act2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
