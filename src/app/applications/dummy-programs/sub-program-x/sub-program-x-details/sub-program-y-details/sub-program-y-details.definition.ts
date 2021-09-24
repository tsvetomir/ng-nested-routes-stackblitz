import { DetailPage } from 'src/app/company/interfaces/page';

export const SubProgramYDetailsDefinition: DetailPage = {
  pageInfo: { title: 'Y Details', path: 'y-details' },
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
        title: 'Program Y Details Title'
      },
      pagerSizes: [5, 10, 15, 20, 50],
      defaultPagerSize: 15,
      source: {
        dataSetName: 'dsJSDOYDetailTableRef',
        tempTableName: 'ttJSDOYDetailTableRef',
        resourceName: 'DD.JSDOYDetailTableRef',
        primaryKeys: ['ProductID']
      },
      columns: [],
      childs: [
        {
          title: 'Z Details',
          path: 'z-details'
        }
      ]
    }
  ]
};
