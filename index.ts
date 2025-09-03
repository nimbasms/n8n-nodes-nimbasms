import { ICredentialType, INodeType } from 'n8n-workflow';
import { NimbaSMS } from './nodes/NimbaSMS/NimbaSMS.node';
import { NimbaSmsApi } from './credentials/NimbaSmsApi.credentials';

export const nodes: INodeType[] = [new NimbaSMS()];
export const credentials: ICredentialType[] = [new NimbaSmsApi()]; 