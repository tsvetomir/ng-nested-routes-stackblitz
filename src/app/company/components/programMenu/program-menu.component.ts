import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DummyProgramsDefinition } from '../../../applications/dummy-programs/dummy-programs.definition';
import { Module, Program } from '../../interfaces/program';

@Component({
  selector: 'sp-program-menu',
  templateUrl: './program-menu.component.html',
  styleUrls: ['./program-menu.component.scss']
})
export class ProgramMenuComponent {
  constructor(private router: Router) {}
  public subPrograms: Array<Module | Program> = DummyProgramsDefinition;

  getPath(path: string) {
    return this.router.url + '/' + path;
  }
}
