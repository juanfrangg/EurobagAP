import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-mostrar',
  templateUrl: './mostrar.component.html',
  styleUrls: ['./mostrar.component.scss'],
})
export class MostrarComponent implements OnInit {

  public imagenes: string[] = [];


  constructor(private modalController: ModalController) { }

  ngOnInit() {
    // fetch('/assets/')
    //   .then(response => response.text())
    //   .then(html => {
    //     const parser = new DOMParser();
    //     const doc = parser.parseFromString(html, 'text/html');
    //     const links = doc.getElementsByTagName('a');
  
    //     for (let i = 0; i < links.length; i++) {
    //       const href:any = links[i].getAttribute('href');
    //       if (href && href.endsWith('.jpg') || href.endsWith('.png')) {
    //         this.imagenes.push(href);
    //       }
    //     }
    //   });
  }
  

  cerrarModal() {
    this.modalController.dismiss();
  }

}
