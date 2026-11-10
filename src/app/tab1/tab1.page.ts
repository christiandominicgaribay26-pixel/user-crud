import { Component } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { NewProduct, ProductService } from '../services/product.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {

  newProduct: NewProduct = {
    productName: '',
    category: 'Other',
    price: 0,
    quantity: 1
  };

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private productService: ProductService
  ) {}

  async addProduct() {
    if (!this.newProduct.productName.trim() || this.newProduct.price < 0 || this.newProduct.quantity < 0) {
      await this.showToast('Enter a product name and valid price and quantity.', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Saving product...' });
    await loading.present();

    try {
      await this.productService.addProduct(this.newProduct);

      this.newProduct = {
        productName: '',
        category: 'Other',
        price: 0,
        quantity: 1
      };
      await this.showToast('Product added successfully.', 'success');
    } catch (error) {
      console.error('Error adding product:', error);
      await this.showToast('Failed to save product.', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  private async showToast(message: string, color: 'success' | 'warning' | 'danger') {
    const toast = await this.toastCtrl.create({ message, duration: 2200, color, position: 'bottom' });
    await toast.present();
  }
}