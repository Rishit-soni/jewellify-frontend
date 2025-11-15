import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { ImageModule } from 'primeng/image';
import { GalleriaModule } from 'primeng/galleria';
import { catchError, of } from 'rxjs';

import { MessageService } from 'primeng/api';
import { ItemService } from '../../../core/services/item.service';
import { CategoryService } from '../../../core/services/category.service';
import { Item } from '../../../core/models/item.model';
import { Category } from '../../../core/models/category.model';

@Component({
    selector: 'app-item-details',
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        ButtonModule,
        TableModule,
        TagModule,
        SkeletonModule,
        ImageModule,
        GalleriaModule,
    ],
    templateUrl: './item-details.component.html',
    styleUrls: ['./item-details.component.css'],
})
export class ItemDetailsComponent implements OnInit {
    item: Item | null = null;
    loading = false;
    itemId: string | null = null;
    category: Category | null = null;
    images: string[] = [];
    responsiveOptions: any[] = [
        {
            breakpoint: '1024px',
            numVisible: 5
        },
        {
            breakpoint: '768px',
            numVisible: 3
        },
        {
            breakpoint: '560px',
            numVisible: 1
        }
    ];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private itemService: ItemService,
        private categoryService: CategoryService,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.itemId = this.route.snapshot.paramMap.get('id');
        if (this.itemId) {
            this.loadItemDetails();
        }
    }

    loadItemDetails(): void {
        if (!this.itemId) return;

        this.loading = true;
        this.itemService.getItemById(this.itemId)
            .pipe(
                catchError((err) => {
                    console.error('Failed to load item details', err);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to load item details',
                    });
                    this.loading = false;
                    return of(null);
                })
            )
            .subscribe((item) => {
                if (item) {
                    this.item = item;
                    this.images = item.images || [];
                    this.loadCategoryDetails();
                }
                this.loading = false;
            });
    }

    loadCategoryDetails(): void {
        if (!this.item?.category) return;

        this.categoryService.getCategories().subscribe({
            next: (response) => {
                this.category = response.categories.find(cat => cat.name === this.item?.category) || null;
            },
            error: (err) => {
                console.error('Failed to load category details', err);
            },
        });
    }

    onEditItem(): void {
        if (this.itemId) {
            this.router.navigate(['/inventory/edit', this.itemId]);
        }
    }

    onBackToList(): void {
        this.router.navigate(['/inventory']);
    }

    calculateLabourCost(): number {
        if (!this.item?.labour || !this.item.grossWeight) return 0;

        const { mode, amount } = this.item.labour;
        const weight = this.item.grossWeight;

        switch (mode) {
            case 'percentage_per_gram':
                return (amount / 100) * weight;
            case 'rupees_per_gram':
                return amount * weight;
            case 'fixed_amount':
                return amount;
            default:
                return 0;
        }
    }

    calculateOtherChargesTotal(): number {
        if (!this.item?.otherCharges) return 0;
        return this.item.otherCharges.reduce((total, charge) => total + (charge.amount || 0), 0);
    }

    calculateTotalCost(): number {
        const labourCost = this.calculateLabourCost();
        const otherCharges = this.calculateOtherChargesTotal();
        return labourCost + otherCharges;
    }

    getGalleriaImages(): any[] {
        if (!this.images || !this.item) return [];
        return this.images.map(img => ({ source: img, alt: this.item!.name }));
    }
}
