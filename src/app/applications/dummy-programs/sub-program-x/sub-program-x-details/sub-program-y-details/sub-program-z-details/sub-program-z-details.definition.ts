// import { DetailPage } from '../../../../company/interfaces/page';
import { DetailPage } from 'src/app/company/interfaces/page';

export const SubProgramZDetailsDefinition: DetailPage = {
  pageInfo: { title: 'Z Details', path: 'z-details' },
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
        title: 'Program Z Title'
      },
      pagerSizes: [5, 10, 15, 20, 50],
      defaultPagerSize: 15,
      source: {
        dataSetName: 'dsJSDOSubZDetailTableRef',
        tempTableName: 'ttJSDOZDetailTableRef',
        resourceName: 'DD.JSDOZDetailTableRef',
        primaryKeys: ['ProductID']
      },
      columns: [],
      childs: [
        {
          title: 'A Details',
          path: 'a-details'
        }
      ]
    }
  ]
};
