import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MetalRatesService, MetalRates } from '../../../core/services/metal-rates.service';

@Component({
    selector: 'app-live-rates',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="bg-card border border-theme rounded-xl p-4 shadow-sm fade-in" *ngIf="rates">
      <div class="flex items-center justify-between mb-4 border-b border-theme pb-2">
        <h4 class="text-xs font-bold text-main uppercase tracking-wider flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-sm shadow-red-500/50"></span>
          Live Market Rates
        </h4>
        <span class="text-[10px] text-secondary font-mono bg-surface-100 px-1.5 py-0.5 rounded">{{ rates.gold.timestamp | date:'HH:mm:ss' }}</span>
      </div>
      
      <div class="space-y-4">
        <!-- Gold Rate -->
        <div class="flex justify-between items-center group">
          <div class="flex items-center gap-3">
             <div class="w-10 h-10 rounded-lg bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 flex items-center justify-center font-bold text-sm border border-yellow-100 dark:border-yellow-900/50 group-hover:scale-105 transition-transform shadow-sm">
              Au
            </div>
            <div>
              <p class="text-xs text-secondary font-medium tracking-wide uppercase">Gold (24K)</p>
              <div class="flex items-baseline gap-1">
                <span class="text-lg font-bold text-main font-mono">₹{{ rates.gold.price | number:'1.0-0' }}</span>
              </div>
            </div>
          </div>
          <div class="text-right">
             <div class="px-2 py-0.5 rounded text-xs font-mono font-medium inline-flex items-center gap-1"
                  [ngClass]="rates.gold.change >= 0 ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'">
                <i class="pi" [ngClass]="rates.gold.change >= 0 ? 'pi-arrow-up text-[10px]' : 'pi-arrow-down text-[10px]'"></i>
                {{ Math.abs(rates.gold.change) | number:'1.2-2' }}%
             </div>
             <p class="text-[10px] text-secondary mt-1">per 10g</p>
          </div>
        </div>

        <!-- Silver Rate -->
        <div class="flex justify-between items-center group">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300 flex items-center justify-center font-bold text-sm border border-slate-100 dark:border-slate-700 group-hover:scale-105 transition-transform shadow-sm">
              Ag
            </div>
            <div>
              <p class="text-xs text-secondary font-medium tracking-wide uppercase">Silver</p>
               <div class="flex items-baseline gap-1">
                <span class="text-lg font-bold text-main font-mono">₹{{ rates.silver.price | number:'1.0-0' }}</span>
              </div>
            </div>
          </div>
           <div class="text-right">
             <div class="px-2 py-0.5 rounded text-xs font-mono font-medium inline-flex items-center gap-1"
                  [ngClass]="rates.silver.change >= 0 ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'">
                <i class="pi" [ngClass]="rates.silver.change >= 0 ? 'pi-arrow-up text-[10px]' : 'pi-arrow-down text-[10px]'"></i>
                {{ Math.abs(rates.silver.change) | number:'1.2-2' }}%
             </div>
             <p class="text-[10px] text-secondary mt-1">per 1kg</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LiveRatesComponent implements OnInit, OnDestroy {
    rates: MetalRates | null = null;
    private sub: Subscription | null = null;
    Math = Math;

    constructor(private rateService: MetalRatesService) { }

    ngOnInit() {
        this.sub = this.rateService.rates$.subscribe(rates => {
            this.rates = rates;
        });
    }

    ngOnDestroy() {
        this.sub?.unsubscribe();
    }
}
