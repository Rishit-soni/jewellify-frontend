# UI/UX Overhaul & Feature Enhancement Plan

**Date**: February 7, 2026  
**Status**: 🚧 IN PROGRESS  
**Estimated Time**: 4-6 hours

---

## 📋 Requirements Breakdown

### ✅ Phase 1: Quick Fixes (30 minutes)
1. ✅ Remove calculated labour display (needs gold rate)
2. ⏳ Move Categories to top in Settings page
3. ⏳ Verify images display in details view

### 🔄 Phase 2: Modern UI Theme (2 hours)
1. ⏳ Create consistent color scheme
2. ⏳ Update all list pages (Inventory, Customers, Settings)
3. ⏳ Improve cards, buttons, and spacing
4. ⏳ Add hover effects and transitions
5. ⏳ Better typography and icons

### 🔄 Phase 3: Keyboard Accessibility (1 hour)
1. ⏳ Add tabindex to all interactive elements
2. ⏳ Implement keyboard shortcuts
3. ⏳ Add focus indicators
4. ⏳ ARIA labels for screen readers
5. ⏳ Keyboard navigation for modals/dialogs

### 🔄 Phase 4: Dark Theme (1.5 hours)
1. ⏳ Create dark theme CSS variables
2. ⏳ Add theme toggle in header
3. ⏳ Update all components for dark mode
4. ⏳ Save theme preference in localStorage
5. ⏳ Smooth theme transitions

### 🔄 Phase 5: Gold/Silver Rates API (1.5 hours)
1. ⏳ Research and integrate third-party API
2. ⏳ Create rate service with auto-refresh (5 min)
3. ⏳ Display rates in dashboard/header
4. ⏳ Add loading and error states
5. ⏳ Cache rates in localStorage

---

## 🎨 Modern UI Theme Design

### Color Palette:
```css
/* Light Theme */
--primary: #6366f1 (Indigo)
--primary-dark: #4f46e5
--primary-light: #818cf8
--secondary: #10b981 (Emerald)
--accent: #f59e0b (Amber)
--danger: #ef4444 (Red)
--warning: #f59e0b (Amber)
--success: #10b981 (Emerald)
--background: #f9fafb
--surface: #ffffff
--text-primary: #111827
--text-secondary: #6b7280
--border: #e5e7eb

/* Dark Theme */
--primary: #818cf8
--primary-dark: #6366f1
--primary-light: #a5b4fc
--secondary: #34d399
--accent: #fbbf24
--danger: #f87171
--warning: #fbbf24
--success: #34d399
--background: #111827
--surface: #1f2937
--text-primary: #f9fafb
--text-secondary: #9ca3af
--border: #374151
```

### Typography:
- **Headings**: Inter, bold, larger sizes
- **Body**: Inter, regular
- **Monospace**: JetBrains Mono (for codes)

### Components Style:
- **Cards**: Elevated with shadow, rounded corners (8px)
- **Buttons**: Rounded (6px), hover effects, focus rings
- **Inputs**: Outlined, focus states, clear icons
- **Tables**: Striped rows, hover states, sticky headers
- **Badges**: Rounded-full, small text, vibrant colors

---

## ⌨️ Keyboard Accessibility Plan

### Global Shortcuts:
- `Alt + D` - Dashboard
- `Alt + I` - Inventory
- `Alt + C` - Customers
- `Alt + O` - Orders
- `Alt + S` - Settings
- `Ctrl + K` - Search
- `Ctrl + N` - New Item/Customer
- `Esc` - Close modals/dialogs
- `Tab` - Navigate forward
- `Shift + Tab` - Navigate backward

### Focus Management:
- Visible focus rings (2px solid primary color)
- Skip to main content link
- Focus trap in modals
- Logical tab order

### ARIA Labels:
- All buttons have aria-label
- Form inputs have aria-describedby
- Tables have aria-label
- Icons have aria-hidden="true"

---

## 🌙 Dark Theme Implementation

### Theme Toggle:
```html
<button (click)="toggleTheme()" aria-label="Toggle theme">
  <i class="pi" [ngClass]="isDark ? 'pi-sun' : 'pi-moon'"></i>
</button>
```

### CSS Variables Approach:
```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #111827;
}

[data-theme="dark"] {
  --bg-primary: #111827;
  --text-primary: #f9fafb;
}
```

### Components to Update:
- Sidebar
- Header
- All cards
- Tables
- Forms
- Modals
- Buttons
- Inputs

---

## 💰 Gold/Silver Rates API Integration

### API Options:
1. **GoldAPI.io** (Recommended)
   - Free tier: 100 requests/month
   - Real-time rates
   - Multiple currencies

2. **Metals-API.com**
   - Free tier: 50 requests/month
   - Historical data

3. **Alternative**: Create mock service for now

### Implementation:
```typescript
// gold-rate.service.ts
export class GoldRateService {
  private refreshInterval = 5 * 60 * 1000; // 5 minutes
  
  getRates(): Observable<GoldRates> {
    // API call
  }
  
  startAutoRefresh(): void {
    interval(this.refreshInterval).subscribe(() => {
      this.getRates().subscribe();
    });
  }
}
```

### Display Location:
- Dashboard header (prominent)
- Small widget in sidebar
- Item details (for calculation reference)

---

## 📊 List Pages Improvements

### Inventory List:
- ✅ Add image thumbnails
- ✅ Better category badges
- ✅ Hover effects on rows
- ✅ Quick actions menu
- ✅ Bulk selection
- ✅ Export functionality

### Customer List:
- ✅ Avatar placeholders
- ✅ Better contact display
- ✅ Status badges
- ✅ Quick call/email buttons
- ✅ Search with debounce

### Settings Page:
- ✅ Move Categories to top
- ✅ Tabbed interface
- ✅ Better section headers
- ✅ Improved forms

---

## 🎯 Priority Order

### Immediate (Do First):
1. ✅ Remove calculated labour
2. Move Categories to top in Settings
3. Add keyboard accessibility basics
4. Improve list page UI

### High Priority:
5. Implement dark theme
6. Add consistent theming
7. Integrate gold/silver rates API

### Medium Priority:
8. Advanced keyboard shortcuts
9. Accessibility audit
10. Performance optimization

---

## 📝 Implementation Checklist

### Phase 1: Quick Fixes
- [x] Remove calculated labour display
- [ ] Move Categories section to top in Settings
- [ ] Verify images in details view

### Phase 2: Modern UI
- [ ] Create theme CSS variables
- [ ] Update Inventory list page
- [ ] Update Customer list page
- [ ] Update Settings page
- [ ] Improve buttons and cards
- [ ] Add hover effects

### Phase 3: Keyboard Accessibility
- [ ] Add tabindex to buttons
- [ ] Add keyboard shortcuts
- [ ] Add focus indicators
- [ ] Add ARIA labels
- [ ] Test with keyboard only

### Phase 4: Dark Theme
- [ ] Create dark theme variables
- [ ] Add theme toggle button
- [ ] Update all components
- [ ] Add theme persistence
- [ ] Test all pages in dark mode

### Phase 5: Gold/Silver Rates
- [ ] Research API options
- [ ] Create rate service
- [ ] Add auto-refresh logic
- [ ] Display in dashboard
- [ ] Add loading states

---

## 🚀 Next Steps

1. **Continue with Settings page** - Move Categories to top
2. **Create theme service** - For dark mode
3. **Update list pages** - Modern UI
4. **Add keyboard support** - Accessibility
5. **Integrate rates API** - Gold/Silver prices

---

**Estimated Completion**: 4-6 hours  
**Current Progress**: 10%  
**Status**: Phase 1 in progress
