import { INodeProperties } from 'n8n-workflow';

export const smsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['message'],
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
				name: 'Verification OTP',
				value: 'verification',
				description: 'Send OTP verification code',
				action: 'Send OTP verification',
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
				resource: ['message'],
				operation: ['send'],
			},
		},
		default: '',
		required: true,
		description: 'Select the sender name from available options',
	},
	{
		displayName: 'Phone Numbers',
		name: 'contact',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
			multipleValueButtonText: 'Add Phone Number',
		},
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
			},
		},
		default: {
			contact: [
				{
					phoneNumber: '',
				},
			],
		},
		required: true,
		description: 'The recipient phone numbers (up to 50 numbers, including country code)',
		placeholder: 'Add phone number',
		options: [
			{
				displayName: 'Phone Number',
				name: 'phoneNumber',
				type: 'string',
				default: '',
				description: 'Phone number with country code',
				placeholder: '+224623000000',
			},
		],
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
				resource: ['message'],
				operation: ['send'],
			},
		},
		default: '',
		required: true,
		description: 'The SMS message content (max 665 characters for concatenated SMS)',
		placeholder: 'Your message content here...',
	},

	/* -------------------------------------------------------------------------- */
	/*                                sms:verification                           */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Sender Name',
		name: 'senderNameVerification',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getSenderNames',
		},
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['verification'],
			},
		},
		default: '',
		required: true,
		description: 'Select the sender name from available options',
	},
	{
		displayName: 'Phone Number',
		name: 'to',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['verification'],
			},
		},
		default: '',
		required: true,
		description: 'Phone number to send OTP verification to',
		placeholder: '+224623000000',
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		typeOptions: {
			rows: 3,
		},
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['verification'],
			},
		},
		default: 'Code de confirmation Nimba SMS <1234>',
		description: 'Message template with <1234> placeholder for OTP code',
		placeholder: 'Code confirmation Nimba SMS <1234>',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['verification'],
			},
		},
		options: [
			{
				displayName: 'Expiry Time (minutes)',
				name: 'expiry_time',
				type: 'number',
				typeOptions: {
					minValue: 5,
					maxValue: 30,
				},
				default: 5,
				description: 'Duration before OTP expires (5-30 minutes)',
			},
			{
				displayName: 'Attempts',
				name: 'attempts',
				type: 'number',
				typeOptions: {
					minValue: 3,
					maxValue: 10,
				},
				default: 3,
				description: 'Number of attempts allowed (3-10)',
			},
			{
				displayName: 'Code Length',
				name: 'code_length',
				type: 'number',
				typeOptions: {
					minValue: 4,
					maxValue: 8,
				},
				default: 4,
				description: 'Length of the OTP code (4-8 digits)',
			},
		],
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
				resource: ['message'],
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
				resource: ['message'],
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
				resource: ['message'],
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
				resource: ['message'],
				operation: ['get'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the SMS to retrieve',
	},
];