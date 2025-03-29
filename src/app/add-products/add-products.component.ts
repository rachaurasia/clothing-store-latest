import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-products',
  standalone:false,
  templateUrl: './add-products.component.html',
  styleUrl: './add-products.component.scss'
})
export class AddProductsComponent implements OnInit {

  clothingForm!: FormGroup;
  imageFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null; // Variable to store the image preview


  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.clothingForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl('', [Validators.required, Validators.minLength(10)]),
      price: new FormControl('', [Validators.required, Validators.min(0)]),
      image: new FormControl('', [Validators.required])  // Handle image file
    });
  }

  onImageSelected(event: any): void {
    this.imageFile = event.target.files[0];
  }

  onSubmit(): void {
    if (this.clothingForm.valid && this.image) {
      const formData = new FormData();
      formData.append('name', this.clothingForm.get('name')?.value);
      formData.append('description', this.clothingForm.get('description')?.value);
      formData.append('price', this.clothingForm.get('price')?.value);
      formData.append('image', this.clothingForm.get('image')?.value);
      

      this.http.post('http://localhost:8080/api/products/add', formData).subscribe(
        (response) => {
          console.log('Item added:', response);
          this.router.navigate(['/items']); // Redirect to items page after submission
        },
        (error) => {
          console.error('Error adding item:', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }

  get name() {
    return this.clothingForm.get('name');
  }

  get description() {
    return this.clothingForm.get('description');
  }

  get price() {
    return this.clothingForm.get('price');
  }

  get image() {
    return this.clothingForm.get('image');
  }

    // Handle the image input change and display preview
    onImageChange(event: Event): void {
      const fileInput = event.target as HTMLInputElement;
      const file = fileInput?.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result; // Set the image preview
        };
        reader.readAsDataURL(file);
        // Optionally, you can store the file in the form, depending on your back-end setup
        this.clothingForm.patchValue({ image: file });
      }
    }
}
