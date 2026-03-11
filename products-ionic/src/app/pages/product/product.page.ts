import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  IonRefresher,
  IonRefresherContent
} from '@ionic/angular/standalone';
import { ProductService } from '../../services/product-service';
import { Product } from '../../models/product.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, ReactiveFormsModule, FormsModule, IonRefresher, IonRefresherContent, IonSpinner, IonItem, IonList, IonLabel]
})
export class ProductPage implements OnInit {

  products: Product[] = [];
  loading = false;
  error: string | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.error = null;

    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error cargando productos';
        this.loading = false;
      }
    });
  }

  refresh(event: any) {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        event.target.complete();
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error cargando productos';
        event.target.complete();
      }
    });
  }
}
