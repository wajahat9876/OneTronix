/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable import/prefer-default-export */

export interface IFilterState {
  accordionOpen: string;
}

export const types = {
  setData: 'SET_DATA',
  resetFilters: 'RESET_FILTERS',
};

export const initialState: IFilterState = {
  accordionOpen: '',
};

export const actions = {
  setData: (value: { accordionOpen?: string }) => ({
    type: types.setData,
    payload: value,
  }),
  resetFilters: () => ({
    type: types.resetFilters,
    payload: initialState,
  }),
};

export const reducer = (
  state: typeof initialState,
  action: {
    type: string;
    payload: any;
  },
) => {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        ...action.payload,
      };
    case 'RESET_FILTERS':
      return {
        ...initialState,
      };

    default:
      return state;
  }
};
