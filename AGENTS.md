# AGENTS.md - Development Guide for AI Assistants

This file contains important information for AI coding assistants working on this project.

## Project Overview

**Project Name**: Jewellify - Jewelry Inventory & Billing System  
**Framework**: Angular 20.2.0 (Standalone Components)  
**UI Library**: PrimeNG 20.2.0  
**Styling**: Tailwind CSS 3.x  
**Backend API**: Node.js/Express (separate repository)

## Frequently Used Commands

### Development
```bash
npm start                    # Start dev server on port 4200
npm start -- --port 4201     # Start on different port
npm run watch                # Build and watch for changes
```

### Build & Test
```bash
npm run build                # Production build
npm test                     # Run unit tests
```

### Code Quality
```bash
ng lint                      # Lint code (if configured)
```

## Project Structure

```
src/app/
├── core/                    # Core services, guards, interceptors
│   ├── guards/              # Route guards (auth.guard.ts)
│   ├── interceptors/        # HTTP interceptors (jwt, error)
│   ├── models/              # TypeScript interfaces
│   └── services/            # Singleton services
├── features/                # Feature modules (lazy-loaded ready)
│   ├── auth/               # Authentication
│   ├── inventory/          # Inventory management
│   ├── dashboard/          # Dashboard
│   ├── customers/          # Customer management
│   └── orders/             # Order management
├── shared/                  # Shared components
│   └── components/layout/  # App layout
└── environments/            # Environment configs
```

## Code Standards

### File Naming
- Components: `kebab-case.component.ts`
- Services: `kebab-case.service.ts`
- Guards: `kebab-case.guard.ts`
- Models: `kebab-case.model.ts`

### Component Structure
```typescript
@Component({
  selector: 'app-feature-name',
  standalone: true,
  imports: [/* modules */],
  templateUrl: './feature-name.component.html',
  styleUrls: ['./feature-name.component.css']
})
export class FeatureNameComponent implements OnInit { }
```

### Service Structure
```typescript
@Injectable({
  providedIn: 'root'
})
export class FeatureService {
  private readonly API_URL = `${environment.apiUrl}/endpoint`;
  
  constructor(private http: HttpClient) {}
}
```

## PrimeNG v20 Component Names (IMPORTANT!)

PrimeNG v20 has renamed several components. Always use these imports:

```typescript
// OLD (v17-19)          →  NEW (v20)
import { DropdownModule }    →  import { SelectModule } from 'primeng/select';
import { TabViewModule }     →  import { TabsModule } from 'primeng/tabs';
import { SidebarModule }     →  import { DrawerModule } from 'primeng/drawer';
import { InputTextareaModule } → import { TextareaModule } from 'primeng/textarea';
```

### Common PrimeNG Imports
```typescript
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
```

## API Integration

### Base URL
- Development: `http://localhost:3000/api`
- Configure in: `src/environments/environment.ts`

### Authentication
- JWT token stored in `localStorage` as `jwt_token`
- Automatically added to requests via `jwtInterceptor`
- User data stored in `localStorage` as `current_user`

### API Endpoints
```
POST   /api/auth/login           - Login
POST   /api/auth/register        - Register
GET    /api/items                - Get all items (with filters)
GET    /api/items/:id            - Get item by ID
POST   /api/items                - Create item (multipart/form-data)
PUT    /api/items/:id            - Update item
DELETE /api/items/:id            - Delete item
```

### Request Examples
```typescript
// With query parameters
this.http.get(`${API_URL}`, { params: { search: 'ring', category: 'gold' } });

// With FormData (file upload)
const formData = new FormData();
formData.append('name', 'Item Name');
formData.append('images', file);
this.http.post(`${API_URL}`, formData);
```

## Error Handling

### Using MessageService (Toasts)
```typescript
constructor(private messageService: MessageService) {}

// Success
this.messageService.add({
  severity: 'success',
  summary: 'Success',
  detail: 'Item created successfully'
});

// Error
this.messageService.add({
  severity: 'error',
  summary: 'Error',
  detail: err.userMessage || 'Operation failed'
});

// Warning
this.messageService.add({
  severity: 'warn',
  summary: 'Warning',
  detail: 'Please fill all fields'
});
```

### Error Interceptor
- Centralized in `src/app/core/interceptors/error.interceptor.ts`
- Automatically handles 401 (redirect to login)
- Provides `userMessage` property on errors

## Responsive Design

### Tailwind Breakpoints
```css
sm:  640px    /* Mobile landscape */
md:  768px    /* Tablet */
lg:  1024px   /* Desktop */
xl:  1280px   /* Large desktop */
2xl: 1536px   /* Extra large */
```

### Common Patterns
```html
<!-- Mobile-first responsive grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- Content -->
</div>

<!-- Hide on mobile, show on desktop -->
<div class="hidden lg:block">Desktop only</div>

<!-- Show on mobile, hide on desktop -->
<div class="lg:hidden">Mobile only</div>
```

## State Management

Currently using **Service-based state** with RxJS:

```typescript
// Service
private currentUserSubject = new BehaviorSubject<User | null>(null);
public currentUser$ = this.currentUserSubject.asObservable();

// Component
this.authService.currentUser$.subscribe(user => {
  this.currentUser = user;
});
```

## Routing

### Protected Routes
```typescript
{
  path: '',
  component: AppLayoutComponent,
  canActivate: [authGuard],
  children: [
    { path: 'dashboard', component: DashboardComponent },
    // More routes...
  ]
}
```

### Navigation
```typescript
// Programmatic
this.router.navigate(['/inventory']);
this.router.navigate(['/inventory/edit', item._id]);

// Template
<a routerLink="/inventory" routerLinkActive="active">Inventory</a>
```

## Common Tasks

### Adding a New Feature Module

1. Create folder structure:
```
src/app/features/new-feature/
├── new-feature-list/
│   ├── new-feature-list.component.ts
│   ├── new-feature-list.component.html
│   └── new-feature-list.component.css
└── new-feature-form/
    ├── new-feature-form.component.ts
    ├── new-feature-form.component.html
    └── new-feature-form.component.css
```

2. Create service:
```typescript
// src/app/core/services/new-feature.service.ts
@Injectable({ providedIn: 'root' })
export class NewFeatureService {
  private readonly API_URL = `${environment.apiUrl}/new-feature`;
  constructor(private http: HttpClient) {}
}
```

3. Create model:
```typescript
// src/app/core/models/new-feature.model.ts
export interface NewFeature {
  _id: string;
  name: string;
  // ...
}
```

4. Add routes:
```typescript
// src/app/app.routes.ts
{ path: 'new-feature', component: NewFeatureListComponent },
{ path: 'new-feature/add', component: NewFeatureFormComponent },
```

5. Add to navigation:
```typescript
// src/app/shared/components/layout/app-layout/app-layout.component.ts
menuItems: MenuItem[] = [
  // ...
  {
    label: 'New Feature',
    icon: 'pi pi-icon',
    routerLink: '/new-feature'
  }
];
```

## Debugging Tips

### Enable Verbose Logging
```typescript
// In service
console.log('API Response:', response);

// In component
console.log('Form Data:', this.formData);
```

### Check Network Requests
- Open DevTools → Network tab
- Filter by XHR to see API calls
- Check request headers for Authorization token

### Common Issues

1. **401 Unauthorized**: Check if token exists in localStorage and is valid
2. **CORS Error**: Backend needs to allow `http://localhost:4200`
3. **Module not found**: Check import paths and PrimeNG v20 naming
4. **Form not submitting**: Check FormsModule is imported and [(ngModel)] is used

## Performance Optimization

### Lazy Loading (Future)
```typescript
{
  path: 'admin',
  loadChildren: () => import('./features/admin/admin.routes').then(m => m.routes)
}
```

### OnPush Change Detection
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

## Testing

### Unit Test Example
```typescript
describe('ItemService', () => {
  let service: ItemService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ItemService]
    });
    service = TestBed.inject(ItemService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch items', () => {
    service.getAllItems({}).subscribe(data => {
      expect(data.items.length).toBeGreaterThan(0);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/items`);
    expect(req.request.method).toBe('GET');
  });
});
```

## Notes for Future Development

1. **PWA**: Run `ng add @angular/pwa` when ready
2. **i18n**: Consider Angular's built-in i18n for multi-language
3. **State Management**: Consider NgRx if app grows complex
4. **Testing**: Add E2E tests with Cypress or Playwright
5. **Documentation**: Update this file when adding new patterns

## Contact

For questions or clarifications, refer to the main README.md or project documentation.

---

**Last Updated**: November 2025  
**Maintainer**: Development Team
