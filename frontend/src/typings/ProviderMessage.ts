export type ProviderMessageType = 'info' | 'warning' | 'danger';

interface ProviderMessage {
  message: string;
  type: ProviderMessageType;
}

export default ProviderMessage;
