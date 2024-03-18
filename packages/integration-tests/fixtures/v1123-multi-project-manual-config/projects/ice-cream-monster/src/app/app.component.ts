import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Ice Cream Monster';
  iceCreamFlavors = ['Vanilla', 'Chocolate', 'Strawberry', 'Mint Chocolate Chip'];

  addIceCreamFlavor(flavor: string) {
    this.iceCreamFlavors.push(flavor);
  }
}
