# Jewellify - Jewelry Inventory & Billing System

A modern, responsive web application built with Angular, PrimeNG, and Tailwind CSS for managing jewelry inventory, customers, and orders.

## Features

### Phase 1 (Current Implementation)
- ✅ **Authentication** - Login and Registration with JWT
- ✅ **Dashboard** - Overview of key metrics
- ✅ **Inventory Management**
  - List all jewelry items with filters
  - Add new items with images
  - Edit existing items
  - Delete items
  - Search and filter by category, stock status
- ✅ **Responsive Design** - Mobile, tablet, and desktop optimized
- ✅ **PWA Ready** - Progressive Web App capabilities

### Upcoming Features
- Customer Management
- Order Processing
- Quotation Generation
- Ledger/Accounting
- Reports and Analytics

## Tech Stack

- **Frontend Framework**: Angular 20.2.0
- **UI Components**: PrimeNG 20.2.0
- **Styling**: Tailwind CSS 3.x
- **Icons**: PrimeIcons
- **HTTP Client**: Angular HttpClient with JWT Interceptor
- **Routing**: Angular Router with Guards

## Project Structure

```
src/
├── app/
│   ├── core/                    # Core functionality
│   │   ├── guards/              # Route guards (auth.guard.ts)
│   │   ├── interceptors/        # HTTP interceptors (jwt, error)
│   │   ├── models/              # TypeScript interfaces/models
│   │   └── services/            # Business logic services
│   ├── features/                # Feature modules
│   │   ├── auth/                # Authentication (login, register)
│   │   ├── dashboard/           # Dashboard component
│   │   ├── inventory/           # Inventory management
│   │   │   ├── item-list/       # List items
│   │   │   └── item-form/       # Add/Edit item
│   │   ├── customers/           # Customer management (placeholder)
│   │   └── orders/              # Order management (placeholder)
│   ├── shared/                  # Shared components
│   │   └── components/
│   │       └── layout/          # App layout with sidebar
│   ├── app.config.ts            # App configuration
│   ├── app.routes.ts            # Routing configuration
│   └── app.ts                   # Root component
├── environments/                # Environment configuration
└── styles.css                   # Global styles

```

## Prerequisites

- Node.js (v20.x or later)
- npm (v10.x or later)
- Angular CLI (`npm install -g @angular/cli`)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd invoice-fe
```

2. Install dependencies:
```bash
npm install
```

3. Update environment configuration:
Edit `src/environments/environment.ts` to point to your backend API:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api' // Your backend URL
};
```

## Development

Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:4200`

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run watch` - Build and watch for changes
- `npm test` - Run unit tests

## Backend Integration

This frontend is designed to work with the Jewellify backend API. Ensure your backend is running with the following endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Inventory
- `GET /api/items` - Get all items (with filters)
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create new item (multipart/form-data)
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

## Key Features Implementation

### Authentication Flow
- JWT-based authentication
- Token stored in localStorage
- JWT interceptor automatically adds token to requests
- Error interceptor handles 401 responses
- Auth guard protects routes

### Inventory Management
- Responsive table with pagination
- Search by name, code, or HUID
- Filter by category and stock status
- Multi-step form for adding items
- Image upload (up to 5 images per item)
- Stock level indicators (In Stock, Low Stock, Out of Stock)

### Responsive Design
- Desktop: Full sidebar navigation
- Mobile: Bottom navigation + drawer menu
- Tablet: Optimized layouts
- Touch-friendly UI elements

## Customization

### Theme
The application uses PrimeNG Aura theme with Tailwind CSS. You can customize:

1. **Tailwind Configuration** (`tailwind.config.js`):
```javascript
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      // Add your customizations
    },
  },
  plugins: [],
}
```

2. **PrimeNG Theme** (`src/app/app.config.ts`):
```typescript
providePrimeNG({
  theme: {
    preset: Aura, // Change theme preset
    options: {
      darkModeSelector: false,
      cssLayer: false
    }
  },
})
```

## Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### PWA Configuration

To enable PWA features:
```bash
ng add @angular/pwa
```

## Deployment

### Deploy to production server:
1. Build the application
2. Upload `dist/` folder contents to your web server
3. Configure server for SPA routing (redirect all routes to index.html)

### Example Nginx Configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist/angular-playground;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Code Standards

- **TypeScript**: Strict mode enabled
- **Formatting**: Prettier configuration included
- **Components**: Standalone components architecture
- **Naming**: Kebab-case for files, PascalCase for classes
- **Error Handling**: Centralized error interceptor
- **State Management**: Service-based with RxJS

## Contributing

1. Follow the existing code structure
2. Use TypeScript interfaces for all data models
3. Handle errors gracefully with user-friendly messages
4. Test on mobile, tablet, and desktop
5. Update this README with new features

## License

Private - All Rights Reserved

## Support

For issues or questions, contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: November 2025
