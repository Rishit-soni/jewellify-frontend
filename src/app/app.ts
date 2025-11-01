import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ButtonModule, CardModule, InputTextModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent { }
