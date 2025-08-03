import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class NimbaSmsApi implements ICredentialType {
	name = 'nimbaSmsApi';
	displayName = 'Nimba SMS API';
	documentationUrl = 'https://developers.nimbasms.com';
	properties: INodeProperties[] = [
		{
			displayName: 'Service ID',
			name: 'serviceId',
			type: 'string',
			default: '',
			required: true,
			description: 'Your Nimba SMS Service ID (SID)',
		},
		{
			displayName: 'Secret Token',
			name: 'secretToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your Nimba SMS Secret Token',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.nimbasms.com',
			required: true,
			description: 'The base URL for the Nimba SMS API',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			auth: {
				username: '={{$credentials.serviceId}}',
				password: '={{$credentials.secretToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/v1/balance',
			method: 'GET',
		},
	};
}