import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  updateDoc
} from 'firebase/firestore';

export interface Product {
  id: string;
  productName: string;
  category: string;
  price: number;
  quantity: number;
}

export type NewProduct = Omit<Product, 'id'>;

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly app = getApps().length ? getApp() : initializeApp(environment.firebase);
  private readonly db = getFirestore(this.app);
  private readonly productsCol = collection(this.db, 'products');
  private readonly productsSubject = new BehaviorSubject<Product[]>([]);
  readonly products$ = this.productsSubject.asObservable();
  private unsubscribe?: () => void;

  constructor() {
    this.loadProducts();
  }

  async addProduct(product: NewProduct): Promise<Product> {
    const productData = {
      ...product,
      productName: product.productName.trim()
    };
    const productRef = await addDoc(this.productsCol, productData);
    const savedProduct = { id: productRef.id, ...productData };
    this.productsSubject.next([...this.productsSubject.value, savedProduct]);
    return savedProduct;
  }

  async updateProduct(product: Product, changes: NewProduct): Promise<void> {
    await updateDoc(doc(this.db, 'products', product.id), changes);
    this.productsSubject.next(
      this.productsSubject.value.map(current =>
        current.id === product.id ? { ...current, ...changes } : current
      )
    );
  }

  async deleteProduct(productId: string): Promise<void> {
    await deleteDoc(doc(this.db, 'products', productId));
    this.productsSubject.next(
      this.productsSubject.value.filter(product => product.id !== productId)
    );
  }

  async loadProducts(): Promise<void> {
    const snapshot = await getDocs(this.productsCol);
    this.productsSubject.next(this.mapProducts(snapshot.docs));

    this.unsubscribe?.();
    this.unsubscribe = onSnapshot(this.productsCol, liveSnapshot => {
      this.productsSubject.next(this.mapProducts(liveSnapshot.docs));
    });
  }

  private mapProducts(productDocs: Array<{ id: string; data: () => Record<string, unknown> }>): Product[] {
    return productDocs.map(productDoc => {
      const data = productDoc.data() as Partial<Product> & { name?: string };
      return {
        id: productDoc.id,
        productName: String(data.productName ?? data.name ?? 'Unnamed product'),
        category: String(data.category ?? 'Other'),
        price: Number(data.price ?? 0),
        quantity: Number(data.quantity ?? 0)
      };
    });
  }
}