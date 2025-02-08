import { ButtonProps } from '@/types/buttonTypes';

export interface buttonAndPartProps extends ButtonProps {
  partID: string;
}

export interface partPropsWithSetter extends buttonAndPartProps {
  setPartID: React.Dispatch<React.SetStateAction<string>>;
}
