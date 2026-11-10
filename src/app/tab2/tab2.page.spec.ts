import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';

import { Tab2PageModule } from './tab2.module';
import { Tab2Page } from './tab2.page';

describe('Tab2Page', () => {
  let component: Tab2Page;
  let fixture: ComponentFixture<Tab2Page>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tab2PageModule, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(Tab2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render products from the list', () => {
    component.products = [
      { id: '1', productName: 'Laptop', category: 'Electronics', price: 500, quantity: 2 },
      { id: '2', productName: 'Notebook', category: 'School', price: 5, quantity: 10 }
    ];

    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Laptop');
    expect(text).toContain('Electronics');
    expect(text).toContain('Notebook');
  });
});
