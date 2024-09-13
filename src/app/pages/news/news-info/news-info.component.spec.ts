import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsInfoComponent } from './news-info.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
xdescribe('NewsInfoComponent', () => {
  let component: NewsInfoComponent;
  let fixture: ComponentFixture<NewsInfoComponent>;

  beforeEach(async () => {
    const activatedRouteStub = {
      data: of({ newsInfo: {} }),
    };
    await TestBed.configureTestingModule({
      declarations: [NewsInfoComponent],
      imports: [HttpClientModule, RouterTestingModule, ReactiveFormsModule],
    }).compileComponents();
    component.ngOnInit();
    fixture = TestBed.createComponent(NewsInfoComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
