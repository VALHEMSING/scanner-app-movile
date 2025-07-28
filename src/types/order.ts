export type OrderActionOptions = {
  action: () => Promise<void>;
  succesMessages?: string;
  errorMessages?: string;
};
