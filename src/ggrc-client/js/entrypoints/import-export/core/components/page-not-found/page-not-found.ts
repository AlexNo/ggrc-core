import {
  Component,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'page-not-found',
  templateUrl: './page-not-found.html'
})
export class PageNotFoundComponent implements OnInit {
  constructor() { }

  ngOnInit() {
    console.log('PageNotFoundComponent initialized!');
  }
}