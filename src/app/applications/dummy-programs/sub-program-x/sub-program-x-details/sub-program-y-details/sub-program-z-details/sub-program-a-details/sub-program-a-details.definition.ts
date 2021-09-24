import { DetailPage } from 'src/app/company/interfaces/page';

export const SubProgramADetailsDefinition: DetailPage = {
  pageInfo: { title: 'A Details', path: 'a-details' },
  pageForm: {
    source: {
      dataSetName: 'dsJSDOTableRef',
      tempTableName: 'ttJSDOTableRef',
      resourceName: 'DD.JSDOTableRef',
      primaryKeys: ['ProductID']
    },
    fieldSets: []
  },
  pageGrids: [
    {
      gridInfo: {
        title: 'Program A Title'
      },
      pagerSizes: [5, 10, 15, 20, 50],
      defaultPagerSize: 15,
      source: {
        dataSetName: 'dsJSDOSubADetailTableRef',
        tempTableName: 'ttJSDOADetailTableRef',
        resourceName: 'DD.JSDOADetailTableRef',
        primaryKeys: ['ProductID']
      },
      columns: [],
      childs: [
        {
          title: 'Sub Sub Child Details',
          path: 'sub-sub-child-details'
        }
      ]
    }
  ]
};
