# API Integration Update - Postman Collection Sync

## Summary
Updated the Angular frontend to match the latest Postman API collection specifications for item management and user registration.

---

## 🔄 Item Management Updates

### **Key Changes:**
1. **Item Code is now AUTO-GENERATED** - No longer user input
   - Backend generates codes based on category (e.g., "Gents ring" → GR0001, GR0002)
   - Item code field removed from create form
   - Item code field disabled in edit mode

2. **Stock Quantity removed from create form**
   - No longer part of the initial item creation
   - Items are tracked separately in inventory

3. **Updated Categories**
   - Old: `Ring`, `Necklace`, `Earring`, etc.
   - New: `Gents ring`, `Ladies ring`, `Necklace`, `Earring`, etc.

### **API Endpoint:**
```
POST /api/items (FormData)
Fields:
- name* (string)
- description (string)
- category* (string) → Auto-generates itemCode
- grossWeight* (number)
- netWeight* (number)
- source* (string)
- huid* (string)
- images (file[]) - max 5 images
```

### **Files Modified:**
- ✅ `src/app/core/models/item.model.ts`
  - Removed `itemCode` and `stockQty` from `CreateItemRequest`
  
- ✅ `src/app/features/inventory/item-form/item-form.component.ts`
  - Removed itemCode from form data
  - Removed stockQty from form data
  - Updated categories list
  - Updated validation logic
  
- ✅ `src/app/features/inventory/item-form/item-form.component.html`
  - Removed Item Code input field
  - Added helper text for category (explains auto-generation)
  - Disabled category selection in edit mode
  - Removed Stock Quantity input
  - Renamed tab to "Weight & HUID"

- ✅ `src/app/features/inventory/item-list/item-list.component.ts`
  - Updated categories dropdown to match new values

---

## 👥 User Registration Updates

### **Key Changes:**
User registration now creates BOTH a tenant (business) AND a user account in one API call.

### **API Endpoint:**
```
POST /api/auth/register
Required Fields:
- userName* (string) - User's full name
- email* (string) - User's email
- password* (string) - Min 6 characters
- role* (string) - 'Admin' | 'Manager'
- businessName* (string) - Store/business name
- ownerName* (string) - Business owner name
- phone* (string) - Contact phone
- address (string) - Optional
- gstNumber (string) - Optional
```

### **Files Modified:**
- ✅ `src/app/features/settings/settings.component.html`
  - Split form into two sections: "User Details" and "Business Details"
  - Added Business Name field*
  - Added Owner Name field*
  - Made Phone field required*
  - Added GST Number field (optional)
  - Added Address field (optional, textarea)

- ✅ `src/app/features/settings/settings.component.ts`
  - Added TextareaModule import
  - Updated validation to check all required fields
  - Added password length validation (min 6 chars)
  - Improved error messages

- ✅ `src/app/core/models/auth.model.ts`
  - Already had all fields defined correctly ✓

---

## 📝 Form UI Improvements

### Item Form:
- **Before:** 3 tabs (Basic Details | Weight & Stock | Images)
- **After:** 3 tabs (Basic Details | Weight & HUID | Images)
- Removed manual item code entry
- Category field now shows helper text explaining auto-generation
- Category disabled in edit mode to prevent code changes
- Cleaner, more focused form

### User Registration Form:
- **Before:** Simple 5-field form
- **After:** Comprehensive 9-field form split into sections:
  - User Details: Name, Email, Password, Role
  - Business Details: Business Name, Owner Name, Phone*, GST, Address

---

## ✅ Validation Updates

### Item Form Validation:
```typescript
Required fields:
- Name ✓
- Category ✓
- Source/Vendor ✓
- Gross Weight > 0 ✓
- Net Weight > 0 ✓
- HUID ✓
- Images (min 1, max 5) ✓

Removed validations:
- Item Code (auto-generated)
- Stock Quantity (not in create flow)
```

### User Registration Validation:
```typescript
Required fields:
- User Name ✓
- Email ✓
- Password (min 6 chars) ✓
- Role ✓
- Business Name ✓
- Owner Name ✓
- Phone ✓

Optional fields:
- Address
- GST Number
```

---

## 🎨 Category Mapping (Item Code Prefixes)

According to Postman collection:
```
"Gents ring"   → GR0001, GR0002, GR0003...
"Ladies ring"  → LR0001, LR0002, LR0003...
"Necklace"     → Backend will define prefix
"Earring"      → Backend will define prefix
"Bracelet"     → Backend will define prefix
"Pendant"      → Backend will define prefix
"Anklet"       → Backend will define prefix
```

---

## 🧪 Testing Checklist

### Item Management:
- [ ] Create new Gents ring → Check auto-generated code starts with GR
- [ ] Create new Ladies ring → Check auto-generated code starts with LR
- [ ] Edit existing item → Category should be disabled
- [ ] Upload 1-5 images → Should work
- [ ] Try upload 6 images → Should show error
- [ ] Leave required field empty → Should show validation error

### User Registration:
- [ ] Create user with all required fields → Should succeed
- [ ] Create user missing business name → Should show validation error
- [ ] Create user with password < 6 chars → Should show validation error
- [ ] Create user with optional fields filled → Should succeed

---

## 📌 Notes

1. **Item Code Generation:**
   - Item codes are now server-generated based on category
   - Frontend no longer needs to validate uniqueness
   - Backend handles sequential numbering per category

2. **Stock Management:**
   - Stock quantity is managed separately from item creation
   - Items are created first, then stock is tracked through orders/inventory

3. **Multi-Tenant Support:**
   - User registration creates isolated tenant/business
   - Each tenant has separate data
   - Users are scoped to their tenant

4. **Backward Compatibility:**
   - Existing items with manually entered codes are preserved
   - Only NEW items will have auto-generated codes
   - Edit mode preserves existing item codes

---

## 🚀 Deployment Notes

No breaking changes for existing data. The form changes are:
- **Additive** for user registration (more fields)
- **Simplifying** for item creation (fewer fields, auto-generation)

All changes are backward compatible with the existing backend API.

---

**Last Updated:** November 2025  
**API Version:** v1 (Multi-Tenant)
