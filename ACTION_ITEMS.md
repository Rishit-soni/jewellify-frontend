# Jewelify Frontend - Quick Action Items

## ✅ COMPLETED (Just Now)

1. **Fixed app.html** - Removed demo content, now shows proper router-outlet
2. **Fixed app.ts** - Added ConfirmDialogModule for confirmation dialogs
3. **Verified environment.prod.ts** - Production environment file exists

## 🔴 CRITICAL - Must Fix Before Production

### 1. Create Registration Component
**Status**: ❌ Not Started  
**Priority**: CRITICAL  
**Estimated Time**: 2-3 hours

**Files to Create:**
- `src/app/features/auth/register/register.component.ts`
- `src/app/features/auth/register/register.component.html`
- `src/app/features/auth/register/register.component.css`

**Route to Add** (in `app.routes.ts`):
```typescript
{ path: 'register', component: RegisterComponent },
```

**Template Structure Needed:**
- Business Name field
- Owner Name field
- Email field
- Phone field
- Password field
- Confirm Password field
- GST Number (optional)
- Address (optional)
- Role selector (Admin/Manager)
- Submit button
- Link back to login

---

### 2. Implement Order Management Module
**Status**: ❌ Not Started (Currently shows "Coming Soon")  
**Priority**: CRITICAL  
**Estimated Time**: 2-3 days

**Components Needed:**
- Order List Component (with table)
- Order Form Component (create/edit)
- Order Details Component (view)

**Models Needed:**
```typescript
export interface Order {
  _id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  itemId: string;
  itemName: string;
  quantity: number;
  price: number;
  total: number;
}
```

**Service Methods Needed:**
- getAllOrders(filters)
- getOrderById(id)
- createOrder(orderData)
- updateOrder(id, orderData)
- deleteOrder(id)
- updateOrderStatus(id, status)

---

### 3. Remove Console.logs from Production Code
**Status**: ❌ Not Started  
**Priority**: HIGH  
**Estimated Time**: 30 minutes

**Files to Clean:**
- `src/app/features/dashboard/dashboard.component.ts` (lines 43, 47, 51, 54, 61)
- `src/app/features/settings/settings.component.ts` (lines 151, 169, 235, 239, 250, 296, 319, 347)

**Action**: Remove or comment out all console.log statements

---

### 4. Add Form Validation
**Status**: ⚠️ Partial (Basic validation exists)  
**Priority**: HIGH  
**Estimated Time**: 4-6 hours

**Areas Needing Validation:**

#### Login Component
- Email format validation
- Password minimum length
- Required field validation

#### Item Form
- Image file size validation (max 5MB per image)
- Image file type validation (jpeg, png, webp only)
- Weight validation (gross >= net)
- HUID format validation

#### Customer Form
- Phone number format validation
- Email format validation
- Duplicate email/phone detection

**Example Implementation:**
```typescript
// Email validation
validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone validation (Indian format)
validatePhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
}

// Image validation
validateImage(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 5MB' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Use JPEG, PNG, or WebP' };
  }
  
  return { valid: true };
}
```

---

## 🟡 HIGH PRIORITY - Fix This Week

### 5. Add Image Preview on Edit
**Status**: ❌ Not Started  
**Estimated Time**: 2-3 hours

**Location**: `src/app/features/inventory/item-form/item-form.component.ts`

**Implementation:**
```typescript
existingImages: string[] = [];
imagesToDelete: string[] = [];

loadItem(): void {
  // ... existing code
  this.existingImages = item.images || [];
}

removeExistingImage(imageUrl: string): void {
  this.imagesToDelete.push(imageUrl);
  this.existingImages = this.existingImages.filter(img => img !== imageUrl);
}

onSaveItem(): void {
  // ... existing code
  if (this.imagesToDelete.length > 0) {
    formData.append('imagesToDelete', JSON.stringify(this.imagesToDelete));
  }
}
```

**Template Addition:**
```html
<div *ngIf="existingImages.length > 0" class="mb-4">
  <label class="block text-sm font-semibold text-gray-700 mb-2">
    Existing Images
  </label>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div *ngFor="let image of existingImages" class="relative">
      <img [src]="image" class="w-full h-32 object-cover rounded-lg" />
      <button
        type="button"
        (click)="removeExistingImage(image)"
        class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
      >
        <i class="pi pi-times"></i>
      </button>
    </div>
  </div>
</div>
```

---

### 6. Add Search Debouncing
**Status**: ❌ Not Started  
**Estimated Time**: 1 hour

**Location**: `src/app/features/inventory/item-list/item-list.component.ts`

**Implementation:**
```typescript
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

searchSubject = new Subject<string>();

ngOnInit(): void {
  this.searchSubject.pipe(
    debounceTime(300),
    distinctUntilChanged()
  ).subscribe(() => {
    this.onSearch();
  });
  
  this.loadCategories();
  this.loadItems();
}

onSearchInputChange(): void {
  this.searchSubject.next(this.filters.search || '');
}
```

**Template Update:**
```html
<input
  pInputText
  [(ngModel)]="filters.search"
  (input)="onSearchInputChange()"
  placeholder="Search by name, code, or HUID"
/>
```

---

### 7. Add Session Timeout
**Status**: ❌ Not Started  
**Estimated Time**: 2 hours

**Location**: `src/app/core/services/auth.service.ts`

**Implementation:**
```typescript
private sessionTimeout: any;
private readonly SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

startSessionTimer(): void {
  this.clearSessionTimer();
  this.sessionTimeout = setTimeout(() => {
    this.logout();
    // Show toast notification
  }, this.SESSION_DURATION);
}

clearSessionTimer(): void {
  if (this.sessionTimeout) {
    clearTimeout(this.sessionTimeout);
  }
}

resetSessionTimer(): void {
  this.startSessionTimer();
}
```

**App Component Update:**
```typescript
@HostListener('document:click')
@HostListener('document:keypress')
@HostListener('document:mousemove')
onUserActivity(): void {
  this.authService.resetSessionTimer();
}
```

---

### 8. Add Forgot Password Feature
**Status**: ❌ Not Started  
**Estimated Time**: 3-4 hours

**Components Needed:**
- Forgot Password Component
- Reset Password Component

**Flow:**
1. User clicks "Forgot Password" on login page
2. User enters email
3. Backend sends reset link/OTP
4. User enters new password
5. Password is reset

---

## 🟢 MEDIUM PRIORITY - Fix This Month

### 9. Add Lazy Loading
**Estimated Time**: 4-6 hours

### 10. Add API Response Caching
**Estimated Time**: 2-3 hours

### 11. Add User Edit Functionality
**Estimated Time**: 2-3 hours

### 12. Write Unit Tests
**Estimated Time**: 1-2 weeks

### 13. Add Dark Mode
**Estimated Time**: 1-2 days

### 14. Add Accessibility Features
**Estimated Time**: 3-5 days

---

## 📊 Progress Tracker

| Category | Total | Completed | In Progress | Not Started |
|----------|-------|-----------|-------------|-------------|
| Critical | 4 | 0 | 0 | 4 |
| High | 4 | 0 | 0 | 4 |
| Medium | 6 | 0 | 0 | 6 |
| **Total** | **14** | **0** | **0** | **14** |

---

## 🎯 Recommended Order of Implementation

### Week 1 (This Week)
1. ✅ Fix app.html and app.ts (DONE)
2. Create Registration Component
3. Remove console.logs
4. Add basic form validation

### Week 2
5. Implement Order Management Module (Part 1 - Models & Service)
6. Implement Order Management Module (Part 2 - Components)
7. Add image preview on edit
8. Add search debouncing

### Week 3
9. Add session timeout
10. Add forgot password feature
11. Add user edit functionality
12. Add lazy loading

### Week 4
13. Add API caching
14. Write unit tests
15. Add dark mode
16. Add accessibility features

---

## 📝 Notes

- **Backend Dependency**: Order management requires backend API endpoints to be ready
- **Testing**: Each feature should be manually tested before moving to the next
- **Documentation**: Update README.md and AGENTS.md as features are added
- **Git Commits**: Make small, focused commits for each feature

---

**Last Updated**: February 7, 2026  
**Status**: 3 Critical Issues Fixed, 11 Remaining
