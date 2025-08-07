/* eslint-disable import/prefer-default-export */
import { RootState } from '@/store';

export const useBusinessDetails = (state: RootState) => state.business;
