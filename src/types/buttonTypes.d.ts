export interface ButtonProps {
  handleButton1: () => void;
  handleButton2?: () => void;
  handleButton3?: () => void;
  handleButton4?: () => void;
}

export interface EndScreenProps extends ButtonProps {
  title: string;
  subtitle: string;
}