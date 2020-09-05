import { AfterViewInit, Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {

  @ViewChild('imageCanvas', { static: false }) canvas: any;
  drawing = false;
  selectedColor = '#263238';
  colors = ['#263238', '#9e9e9e', '#795548', '#ff5722', '#ff9800', '#ffc107', '#ffeb3b', '#4caf50', '#2196f3', '#f44336'];
  lineWidth = 5;

  constructor() { }

  ngAfterViewInit(): void {

  }

  startDrawing(ev) {
    console.log('start ', ev);
    this.drawing = true;
  }

  endDrawing(ev) {
    console.log('end ', ev);
    this.drawing = false;
  }

  moved(ev) {
    console.log('moved ', ev);

  }
}
