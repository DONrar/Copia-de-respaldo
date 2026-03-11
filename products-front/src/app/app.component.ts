import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Product } from './models/product.model';
import { ProductService } from './services/product-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  products: Product[] = [];
  loadingList = false;
  saving = false;
  error: string | null = null;

  newProduct: Product = {
    name: '',
    description: '',
    price: 0
  };

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loadingList = true;
    this.error = null;

    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.loadingList = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error cargando los productos';
        this.loadingList = false;
      }
    });
  }

  addProduct(): void {
    if (!this.newProduct.name || !this.newProduct.description || this.newProduct.price <= 0) {
      return;
    }

    this.saving = true;
    this.error = null;

    this.productService.create(this.newProduct).subscribe({
      next: (created) => {
        this.products.push(created);
        this.newProduct = { name: '', description: '', price: 0 };
        this.saving = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error creando el producto';
        this.saving = false;
      }
    });
  }
}
