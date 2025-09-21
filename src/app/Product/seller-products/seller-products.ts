import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

declare var bootstrap: any; // ใช้สำหรับ Modal ของ Bootstrap

@Component({
  selector: 'app-seller-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './seller-products.html',
  styleUrls: ['./seller-products.scss']
})
export class SellerProducts implements OnInit {
  products: any[] = [];
  loading = false;
  query = '';
  editing: any = null;
productForm

  @ViewChild('productModal') modalElement!: ElementRef;
  modalRef: any;

  constructor(private fb: FormBuilder, private http: HttpClient) {

  this.productForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    imageUrl: [''],
  });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  async loadProducts() {
    this.loading = true;
    try {
      const res: any = await this.http.get('/seller/products').toPromise();
      this.products = res || [];
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
    }
  }

  filtered() {
    const q = this.query.trim().toLowerCase();
    if (!q) return this.products;
    return this.products.filter(
      (p: any) =>
        (p.name || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
    );
  }

  openNew() {
    this.editing = null;
    this.productForm.reset({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      imageUrl: '',
    });
    this.showModal();
  }

  openEdit(p: any) {
    this.editing = p;
    this.productForm.patchValue({
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      imageUrl: p.image_url || '',
    });
    this.showModal();
  }

  async save() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    const payload = this.productForm.value;
    try {
      if (this.editing) {
        await this.http.patch(`/seller/products/${this.editing.id}`, payload).toPromise();
      } else {
        await this.http.post('/seller/products', payload).toPromise();
      }
      this.hideModal();
      await this.loadProducts();
    } catch (err) {
      console.error(err);
    }
  }

  async remove(id: number) {
    if (!confirm('ต้องการลบสินค้านี้ใช่หรือไม่?')) return;
    try {
      await this.http.delete(`/seller/products/${id}`).toPromise();
      await this.loadProducts();
    } catch (err) {
      console.error(err);
    }
  }

  private showModal() {
    if (!this.modalRef) {
      this.modalRef = new bootstrap.Modal(this.modalElement.nativeElement);
    }
    this.modalRef.show();
  }

  private hideModal() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }
}
