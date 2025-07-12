import { Injectable } from '@angular/core';

interface CategoryMolel {
  name: string;
  color: string;
  id: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {}
