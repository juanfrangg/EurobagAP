import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-timermodal',
  templateUrl: './timermodal.component.html',
  styleUrls: ['./timermodal.component.scss'],
})
export class TimermodalComponent implements OnInit {

  constructor(private modalController: ModalController) { }

horas: number = 0;
minutos: number = 0;
segundos: number = 0;
interval: any;

  ngOnInit() {
    this.crono()
  }

  crono(){

      this.interval = setInterval(() => {
        this.segundos++;
        if (this.segundos === 60) {
          this.segundos = 0;
          this.minutos++;
          if (this.minutos === 60) {
            this.minutos = 0;
            this.horas++;
          }
        }
      }, 1000);
    

  }
  

  cerrarModal() {
    this.modalController.dismiss();
    this.horas = 0;
    this.minutos = 0;
    this.segundos = 0;
    clearInterval(this.interval);
  }

}
