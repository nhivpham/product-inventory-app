import { CanDeactivateFn } from '@angular/router';
import { ProductFormComponent } from '../components/product-form/product-form.component';

export const formGuard: CanDeactivateFn<ProductFormComponent> = 
  (component: ProductFormComponent) => {
    if (component.productForm.dirty && !component.formDir?.submitted) {
      return confirm('You have unsaved changes. Do you want to leave this page?');
    }
    return true;
};