import { Component } from '@angular/core';
import { ProductService } from '../product.service';
import { CartService } from '../services/cart.service';
import { Input } from '@angular/core';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-products',
  standalone:false,
    templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

  searchQuery: string = '';
  @Input() searchQueryHeader: string = '';

  constructor(private productService: ProductService,
     private cartService: CartService,
    private searchService: SearchService) {}


  products: any[] = [];

  // ngOnInit(): void {
  //   this.productService.getAllProducts().subscribe((data) => {
  //     this.products = data;
  //   });
  // }


  filteredProducts = [...this.products];
  ngOnInit() {
    this.productService.getAllProducts().subscribe((data) => {
      this.products = data;
      this.filteredProducts = data;
    });
    this.searchService.searchQuery$.subscribe(query => {
      this.searchQuery = query;
      this.filterProducts();
    });
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
    // alert(`${product.name} added to cart!`);
  }
}
