import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Base64ToGallery, Base64ToGalleryOptions } from '@ionic-native/base64-to-gallery/ngx';
import { Platform, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {

  @ViewChild('imageCanvas', { static: false }) canvas: any;
  canvasElement: any;
  saveX: number;
  saveY: number;

  drawing = false;

  selectedColor = '#263238';
  colors = ['#263238', '#9e9e9e', '#795548', '#ff5722', '#ff9800', '#ffc107', '#ffeb3b', '#4caf50', '#2196f3', '#f44336'];
  lineWidth = 5;

  constructor(
    private platform: Platform,
    private base64ToGallery: Base64ToGallery,
    private toastCtrl: ToastController
  ) { }

  ngAfterViewInit(): void {
    // *** Size of the canvas *** //
    this.canvasElement = this.canvas.nativeElement;
    this.canvasElement.width = this.platform.width() + '';
    this.canvasElement.height = 200;
  }

  selectColor(color) {
    this.selectedColor = color;
  }

  startDrawing(ev) {
    this.drawing = true;
    // With this we can know when to start drawing
    const canvasPosition = this.canvasElement.getBoundingClientRect();
    console.log(canvasPosition);
    this.saveX = ev.pageX - canvasPosition.x;
    this.saveY = ev.pageY - canvasPosition.y;
  }

  endDrawing(ev) {
    this.drawing = false;
  }

  moved(ev) {
    if (!this.drawing) { return; }
    // With this we can draw
    const canvasPosition = this.canvasElement.getBoundingClientRect();
    const ctx = this.canvasElement.getContext('2d'); // Get 2d context for the canvas

    const currentX = ev.pageX - canvasPosition.x;
    const currentY = ev.pageY - canvasPosition.y;

    ctx.lineJoin = 'round';
    ctx.strokeStyle = this.selectedColor;
    ctx.lineWidth = this.lineWidth;

    ctx.beginPath();
    ctx.moveTo(this.saveX, this.saveY);
    ctx.lineTo(currentX, currentY);
    ctx.closePath();

    ctx.stroke();

    this.saveX = currentX;
    this.saveY = currentY;
  }

  setBackground() {
    const background = new Image();
    background.src = './assets/sig.png';
    const ctx = this.canvasElement.getContext('2d');

    background.onload = () => {
      ctx.drawImage(background, 0, 0, this.canvasElement.width, this.canvasElement.height);
    }
  }

  exportCanvasImage() {
    const dataUrl = this.canvasElement.toDataURL();
    console.log(dataUrl);

    const ctx = this.canvasElement.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (this.platform.is('cordova')) {
      const options: Base64ToGalleryOptions = { prefix: 'canvas_', mediaScanner: true };
      this.base64ToGallery.base64ToGallery(dataUrl, options).then(
        async res => {
          const toast = await this.toastCtrl.create({
            message: 'Image saved to camera roll.',
            duration: 2000
          });
          toast.present();
        },
        err => console.log('Error saving the image to gallery ', err)
      );
    } else {
      // For browsers
      const data = dataUrl.split(',')[1]; // To remove data:image/png;base64,
      const blob = this.base64toBlob(data, 'image/png');
      const a = window.document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = 'canvassignature.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  base64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    const sliceSize = 512;
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
}
