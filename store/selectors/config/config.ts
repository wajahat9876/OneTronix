/* eslint-disable import/prefer-default-export */
import { RootState } from '@/store';

export const useConfig = (state: RootState) => state.config;
