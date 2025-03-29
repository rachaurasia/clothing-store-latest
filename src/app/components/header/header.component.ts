import { Component, EventEmitter, Output } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-header',
  standalone:false,
  // imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {


  searchQueryHeader: string = '';
  cartItemCount: number = 0;

  activeDropdown: string | null = null;
  

  constructor(private cartService: CartService,
    private searchService: SearchService
  ) {
      this.cartItemCount = cartService.getCartItems().length;
  }

  ngOnInit() {
    this.cartService.cartItemCount$.subscribe(count => {
      this.cartItemCount = count;
    });
  }

  onSearchChange() {
    this.searchService.setSearchQuery(this.searchQueryHeader);
  }

  showDropdown(category: string) {
    this.activeDropdown = category;
  }

  hideDropdown() {
    this.activeDropdown = null;
  }
}
