import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: any[] = [];

  constructor(private snackBar: MatSnackBar) {
    this.loadCart(); // Load cart items when service initializes
  }

  private cartItemCountSubject = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCountSubject.asObservable();

  // Add product to cart
  addToCart(product: any) {
    this.cart.push(product);
    this.saveCart();
    this.updateCartCount();
    this.showNotification(`${product.name} added to cart!`);
  }

  // Get cart items
  getCartItems() {
    return this.cart;
  }

  // Remove item from cart
  removeFromCart(index: number) {
    this.cart.splice(index, 1);
    this.saveCart();
    this.updateCartCount();
    this.showNotification(`${this.cart.indexOf(index).valueOf} removed from cart!`);

  }

  // Clear the cart
  clearCart() {
    this.cart = [];
    this.saveCart();
    this.updateCartCount();
  }

  // Save cart to localStorage
  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  // Load cart from localStorage
  private loadCart() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cart = JSON.parse(storedCart);
    }
  }
  private updateCartCount() {
    this.cartItemCountSubject.next(this.cart.length);
  }

  private showNotification(message: string) {
    this.snackBar.open(message, '🛍️ View Cart', {
      duration: 3000,  // Closes in 3 seconds
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-style']
    });
  }
}
