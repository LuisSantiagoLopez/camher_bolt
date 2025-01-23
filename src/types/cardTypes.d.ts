export interface Data {
  id: number;
  name: string;
  date: string;
  image: string;
  provider: string;
  type?: string;
  isImportant?: boolean;
  justification?: string;
  evidence?: string;
  price?: string;
  status?: number;
}

export interface CardProps {
  type:
    | 'unit'
    | 'counter' // counter receipt
    | 'failure' // failure report (taller)
    | 'admincard' // admin card (both flows)
    | 'receipt'
    | 'provider';

  handleClick: MouseEventHandler<HTMLDivElement>;
  handleBack?: MouseEventHandler<HTMLDivElement>;
  data: Part;
  isAction?: boolean;
}

export interface AuthScreenProps {
  updatePrevTools: (tool: string) => void;
}