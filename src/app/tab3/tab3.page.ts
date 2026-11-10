import { Component, OnDestroy } from '@angular/core';
import { environment } from '../../environments/environment';

import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, Unsubscribe } from 'firebase/firestore';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnDestroy {
  app = getApps().length ? getApp() : initializeApp(environment.firebase);
  db = getFirestore(this.app);
  productsCol = collection(this.db, 'products');

  products: any[] = [];
  private unsubscribeProducts?: Unsubscribe;

  constructor() {}

  ngOnInit() {
    this.subscribeToProducts();
  }

  ionViewWillEnter() {
    this.subscribeToProducts();
  }

  ionViewWillLeave() {
    this.unsubscribeProducts?.();
  }

  ngOnDestroy() {
    this.unsubscribeProducts?.();
  }

  subscribeToProducts() {
    this.unsubscribeProducts?.();

    this.unsubscribeProducts = onSnapshot(
      this.productsCol,
      (snapshot) => {
        this.products = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      },
      (error) => {
        console.error('Error loading products overview:', error);
        this.products = [];
      }
    );
  }

  get totalUsers(): number {
    return this.products.length;
  }
}
