import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'sp-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {
  constructor(private router: Router) {}

  navigateTo(path: string) {
    const pathName = '/' + path;
    this.router.navigate([pathName]);
  }
}
