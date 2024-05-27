import { LOADING_STATUS } from '../../utils/Enum';

export const isNullOrEmpty = (value: any) : boolean => {
  if (value !== undefined && value) {
    if (typeof value === 'object' && Object.keys(value).length !== 0) {
      return false;
    }
    if (typeof value !== 'object' && value.length !== 0) {
      return false;
    }
  }
  return true;
};

export const isLoadingOrNotStarted = (...args: LOADING_STATUS[]) : boolean => args.some((status: LOADING_STATUS) => status === LOADING_STATUS.LOADING || status === LOADING_STATUS.NOT_YET_STARTED);

export const isLoading = (...args: LOADING_STATUS[]) : boolean => args.some((status:LOADING_STATUS) => status === LOADING_STATUS.LOADING);

export const isLoadingOrCompletedOrFailed = (...args: LOADING_STATUS[]) : boolean => args.some((status: LOADING_STATUS) => status === LOADING_STATUS.LOADING || status === LOADING_STATUS.COMPLETED || status === LOADING_STATUS.FAILED);

export const isValidDateTime = (value: any) => (value instanceof Date && !Number.isNaN(value.getTime()));
