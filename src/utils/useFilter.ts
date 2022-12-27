import { GridFilterModel, GridSortModel, GridLinkOperator } from '@mui/x-data-grid-pro';
import { useState } from 'react';

const filterMap = {
  contains: "+contains",
  '>': "+gt",
  '<': "+lt",
  '<=': "+lte",
  '>=': "+gte",
  '!=': "+neq",
  not: "+neq",
  is: "+eq",
  before: "+lt",
  after: "+gt",
  onOrAfter: "+gte",
  onOrBefore: "+lte",
};

export const useFilter = () => {
  const [filter, setFilter] = useState({});
  const [filterModel, setFilterModel] = useState<GridFilterModel>();

  const handleFilterModelChange = (model: GridFilterModel) => {
    if (model.quickFilterValues) {
      setFilter({ '+or': [{ label: { '+contains': model.quickFilterValues[0] }, id: model.quickFilterValues[0] }] });
      setFilterModel(model);
      return;
    }

    console.log(model);
    let newFilter: any = { ...filter };

    if (!model.items?.[0]?.columnField || !model.items?.[0]?.value) {
      setFilter({});
      setFilterModel(undefined);
      return;
    }

    if (model.linkOperator === GridLinkOperator.And) {
      newFilter['+or'] = undefined;
      newFilter['+and'] = [];
      for (const item of model.items) {
        const filterKey = item.operatorValue ? filterMap[item.operatorValue] : undefined;
        if (filterKey) {
          newFilter['+and'].push({ [item.columnField]: { [filterKey]: item.value } });
        }
        else {
          newFilter['+and'].push({ [item.columnField]: item.value });
        }
      }
    } else if (model.linkOperator === GridLinkOperator.Or) {

      newFilter['+or'] = [];
      newFilter['+and'] = undefined;
      for (const item of model.items) {
        const filterKey = item.operatorValue ? filterMap[item.operatorValue as string] : undefined;
        if (filterKey) {
          newFilter['+or'].push({ [item.columnField]: { [filterKey]: item.value } });
        }
        else {
          newFilter['+or'].push({ [item.columnField]: item.value });
        }
      }

    } else {

    }
    setFilter(newFilter);
    setFilterModel(model);
  };

  const handleSortModelChange = (model: GridSortModel) => {
    setFilter(prev => ({ ...prev, '+order_by': model[0]?.field, '+order': model[0]?.sort }));
  };

  return {
    filter,
    filterModel,
    handleFilterModelChange,
    handleSortModelChange
  };
};
