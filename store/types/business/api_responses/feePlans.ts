import { IAPIRespone } from '../..';

export interface FeePlan {
  _id: string;
  feePlanName: string;
  title: string;
  description: string;
  sections: Section[];
}

interface Section {
  title: string;
  subtitle: string;
  items: Item[];
}

interface Item {
  left: string;
  right: string;
}

export type IFeePlanResponse = IAPIRespone<FeePlan[]>;
