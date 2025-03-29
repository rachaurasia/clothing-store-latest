import { Component, OnInit } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone:false,
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  totalAmount: number = 0;
  stripe: Stripe | null = null; // Allow null initially

  constructor(private cartService: CartService) {}

  async ngOnInit() {
    this.cartItems = this.cartService.getCartItems();
    this.totalAmount = this.cartItems.reduce((sum, item) => sum + item.price, 0);

    this.stripe = await loadStripe('pk_test_51R0nSGGydav4F4J059CtFfPM73667vhrUKc8EXqZwAAjBdwmyHqS9pJ0t5DDRpuMSY5Oe7qYyukWoRSZej6yrtOQ00hZY4VdA5'); // Replace with your actual Stripe key

    if (!this.stripe) {
      console.error('Stripe failed to load. Please check your API key.');
    }
  }

  async checkout() {
    if (!this.stripe) {
      console.error('Stripe is not initialized.');
      return;
    }
  
    try {
      if (!this.cartItems || this.cartItems.length === 0) {
        console.error('Cart is empty.');
        return;
      }
  
      // Ensure the request body is an array
      const requestBody = this.cartItems.map(item => ({
        name: item.name,
        price: item.price // Ensure it's a number
      }));
  
      console.log("Sending request:", JSON.stringify(requestBody)); // Debug log
  
      const response = await fetch('http://localhost:8080/api/payment/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody), // Ensure it's sent as an array
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}. Server response: ${errorText}`);
      }
  
      const session = await response.json();
  
      if (!session || !session.id) {
        throw new Error('Invalid session response from backend.');
      }
  
      const { error } = await this.stripe.redirectToCheckout({ sessionId: session.id });
  
      if (error) {
        console.error('Stripe Checkout Error:', error.message);
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.price, 0);
  }
  
  
}
