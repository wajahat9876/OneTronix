export interface IButtonProps {
  btnTitle: string;
  disabled?: boolean;
  btnColor?: string;
  btnTitleColor?: string;
  loading?: boolean;
  loaderColor?: string;
  opacitys?: number;
  onClick: () => void;
}
