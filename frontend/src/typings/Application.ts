import ModelBase from 'App/ModelBase';

export enum ApplicationSyncLevel {
  Disabled = 'disabled',
  AddOnly = 'addOnly',
  FullSync = 'fullSync',
}

interface Application extends ModelBase {
  name: string;
  syncLevel: ApplicationSyncLevel;
  enable: boolean;
  applicationType: string;
  applicationOrder: number;
  implementationName: string;
  implementation: string;
  configContract: string;
  infoLink: string;
  tags: number[];
}

export default Application;
