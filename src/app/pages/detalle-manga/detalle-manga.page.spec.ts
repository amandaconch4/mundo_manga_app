import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleMangaPage } from './detalle-manga.page';

describe('DetalleMangaPage', () => {
  let component: DetalleMangaPage;
  let fixture: ComponentFixture<DetalleMangaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleMangaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
