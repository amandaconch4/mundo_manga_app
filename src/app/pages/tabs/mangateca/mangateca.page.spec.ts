import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MangatecaPage } from './mangateca.page';

describe('MangatecaPage', () => {
  let component: MangatecaPage;
  let fixture: ComponentFixture<MangatecaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MangatecaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
