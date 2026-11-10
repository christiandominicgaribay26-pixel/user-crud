import { Component, OnDestroy } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Product, ProductService } from '../services/product.service';
import { Subscription } from 'rxjs';

interface SlidingItem {
  close: () => Promise<void>;
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnDestroy {

  products: Product[] = [];
  searchTerm = '';
  selectedCategory = 'All';
  categories = ['All', 'Electronics', 'School', 'Home', 'Other'];
  private productsSubscription?: Subscription;

  constructor(
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private productService: ProductService
  ) {
    this.productsSubscription = this.productService.products$.subscribe(products => {
      this.products = products;
    });
  }

  ngOnDestroy() {
    this.productsSubscription?.unsubscribe();
  }

  get filteredProducts(): Product[] {
    const query = this.searchTerm.trim().toLowerCase();
    return this.products.filter(product => {
      const matchesSearch = !query || String(product.productName).toLowerCase().includes(query);
      const matchesCategory = this.selectedCategory === 'All' || product.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  async refreshProducts(event: CustomEvent) {
    try {
      await this.productService.loadProducts();
    } finally {
      (event.target as HTMLIonRefresherElement).complete();
    }
  }

  async deleteProduct(productId: string, slidingItem: SlidingItem) {
    await slidingItem.close();
    const loading = await this.loadingCtrl.create({ message: 'Deleting product...' });
    await loading.present();
    try {
      await this.productService.deleteProduct(productId);
      await this.showToast('Product deleted.', 'success');
    } catch (error) {
      console.error('Error deleting product:', error);
      await this.showToast('Failed to delete product.', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  async updateProduct(product: Product) {
    const alertBox = await this.alertCtrl.create({
      header: 'Update Product',
      inputs: [
        {
          name: 'productName',
          type: 'text',
          value: product.productName,
          placeholder: 'Product name'
        },
        {
          name: 'category',
          type: 'text',
          value: product.category,
          placeholder: 'Category'
        },
        {
          name: 'price',
          type: 'number',
          value: product.price,
          placeholder: 'Price'
        },
        {
          name: 'quantity',
          type: 'number',
          value: product.quantity,
          placeholder: 'Quantity'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Update',
          handler: async (data) => {
            const loading = await this.loadingCtrl.create({ message: 'Updating product...' });
            await loading.present();
            try {
              await this.productService.updateProduct(product, {
                productName: data.productName,
                category: data.category,
                price: Number(data.price),
                quantity: Number(data.quantity)
              });
              await this.showToast('Product updated.', 'success');
            } catch (error) {
              console.error('Error updating product:', error);
              await this.showToast('Failed to update product.', 'danger');
            } finally {
              await loading.dismiss();
            }
          }
        }
      ]
    });

    await alertBox.present();
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({ message, duration: 2200, color, position: 'bottom' });
    await toast.present();
  }
}