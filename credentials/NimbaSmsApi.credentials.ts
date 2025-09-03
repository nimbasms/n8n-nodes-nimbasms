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
			baseURL: 'https://api.nimbasms.com',
			url: '/v1/accounts',
			method: 'GET',
		},
	};
}
