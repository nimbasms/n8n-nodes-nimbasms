import { INodeProperties } from 'n8n-workflow';

export const smsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['sms'],
			},
		},
		options: [
			{
				name: 'Send',
				value: 'send',
				description: 'Send a single SMS',
				action: 'Send an SMS',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many SMS history',
				action: 'Get many SMS',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a specific SMS',
				action: 'Get an SMS',
			},
		],
		default: 'send',
	},
];

export const smsFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                sms:send                                    */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Sender Name',
		name: 'senderName',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getSenderNames',
		},
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['send'],
			},
		},
		default: '',
		required: true,
		description: 'Select the sender name from available options',
	},
	{
		displayName: 'Phone Number',
		name: 'contact',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['send'],
			},
		},
		default: '',
		required: true,
		description: 'The recipient phone number (including country code)',
		placeholder: '+224123456789',
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['send'],
			},
		},
		default: '',
		required: true,
		description: 'The SMS message content (max 665 characters for concatenated SMS)',
		placeholder: 'Your message content here...',
	},

	/* -------------------------------------------------------------------------- */
	/*                                sms:getAll                                 */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['getAll'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Search term to filter SMS',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'Failure',
						value: 'failure',
					},
					{
						name: 'No Credit',
						value: 'no_credit',
					},
					{
						name: 'Not Available',
						value: 'not_available',
					},
					{
						name: 'Received',
						value: 'received',
					},
					{
						name: 'Sent',
						value: 'sent',
					},
				],
				default: 'sent',
				description: 'Filter by SMS status',
			},
			{
				displayName: 'Offset',
				name: 'offset',
				type: 'number',
				typeOptions: {
					minValue: 0,
				},
				default: 0,
				description: 'The initial index from which to return the results',
			},
		],
	},

	/* -------------------------------------------------------------------------- */
	/*                                sms:get                                    */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'SMS ID',
		name: 'smsId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['get'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the SMS to retrieve',
	},
];