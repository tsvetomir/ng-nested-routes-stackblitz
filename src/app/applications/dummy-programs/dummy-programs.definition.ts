import { Module, Program } from '../../company/interfaces/program';

export const DummyProgramsDefinition: Array<Module | Program> = [
  {
    title: 'Program X',
    childs: [
      {
        title: 'Sub Program X',
        path: 'sub-program-x'
      }
    ]
  }
];
