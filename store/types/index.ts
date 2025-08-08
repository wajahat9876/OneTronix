export interface IAPIRespone<ResultType> {
  status: number;
  message: string;
  success: boolean;
  type: string;
  results: ResultType;
}
export interface IAPIResponeData<ResultType> {
  status: number;
  message: string;
  success: boolean;
  type: string;
  // data: ResultType;
}
export interface IAPISuccess {
  status: number;
  success: boolean;
  message: string;
  type?: string;
}

export interface IAPIError {
  name: string;
  status: number;
  success: boolean;
  error: boolean;
  message: string;
}
