import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';

export interface MetalRateData {
    price: number;        // Price in INR
    change: number;       // Percentage change
    changeAmount: number; // Absolute change
    currency: string;
    unit: string;
    timestamp: Date;
}

export interface MetalRates {
    gold: MetalRateData;
    silver: MetalRateData;
}

@Injectable({
    providedIn: 'root'
})
export class MetalRatesService {
    private readonly REFRESH_INTERVAL = 15000; // 15 seconds

    // Initial Base Rates (Realistic Indian Market Prices ~Feb 2024)
    // Gold: 24K per 10g
    // Silver: per 1kg
    private currentRates: MetalRates = {
        gold: {
            price: 162450,
            change: 0.15,
            changeAmount: 95,
            currency: 'INR',
            unit: '10g',
            timestamp: new Date()
        },
        silver: {
            price: 274800,
            change: -0.05,
            changeAmount: -40,
            currency: 'INR',
            unit: '1kg',
            timestamp: new Date()
        }
    };

    private ratesSubject = new BehaviorSubject<MetalRates>(this.currentRates);
    public rates$ = this.ratesSubject.asObservable();

    constructor(private http: HttpClient) {
        this.startSimulation();
    }

    private startSimulation(): void {
        timer(0, this.REFRESH_INTERVAL).subscribe(() => {
            this.updateRates();
        });
    }

    private updateRates(): void {
        const volatility = {
            gold: 0.0005, // Lower volatility for gold
            silver: 0.0008 // Higher volatility for silver
        };

        // Calculate new mock prices
        const goldMove = (Math.random() - 0.45) * volatility.gold; // Slight upward bias logic
        const silverMove = (Math.random() - 0.48) * volatility.silver;

        const newGoldPrice = Math.round(this.currentRates.gold.price * (1 + goldMove));
        const newSilverPrice = Math.round(this.currentRates.silver.price * (1 + silverMove));

        this.currentRates = {
            gold: {
                ...this.currentRates.gold,
                price: newGoldPrice,
                change: goldMove * 100,
                changeAmount: newGoldPrice - this.currentRates.gold.price,
                timestamp: new Date()
            },
            silver: {
                ...this.currentRates.silver,
                price: newSilverPrice,
                change: silverMove * 100,
                changeAmount: newSilverPrice - this.currentRates.silver.price,
                timestamp: new Date()
            }
        };

        this.ratesSubject.next(this.currentRates);
    }

    getRates(): Observable<MetalRates> {
        return this.rates$;
    }
}
