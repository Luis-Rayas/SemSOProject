import { Component, OnInit } from '@angular/core';
import { ItemMenu } from './items.interface';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  practicas !: ItemMenu[];

  constructor() { }

  ngOnInit(): void {
    this.practicas = [
      {
        name: 'Practicas',
        link: '/',
        childs: [
          {
            name: 'Actividad 2 - Práctica 1: Lotes',
            link: 'actividades/act2'
          },
          {
            name: 'Actividad 4 - Práctica 2: Proceso por lotes con Multiprogramación	',
            link: 'actividades/act4'
          }
        ]
      }
    ]
  }
}
