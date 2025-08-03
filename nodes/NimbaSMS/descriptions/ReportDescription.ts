import { INodeProperties } from 'n8n-workflow';

export const reportOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['report'],
			},
		},
		options: [
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Get all reports',
				action: 'Get all reports',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a specific report',
				action: 'Get a report',
			},
		],
		default: 'getAll',
	},
];

export const reportFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                report:getAll                             */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['report'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Start Date',
				name: 'start_date',
				type: 'dateTime',
				default: '',
				description: 'Filter reports from this date',
			},
			{
				displayName: 'End Date',
				name: 'end_date',
				type: 'dateTime',
				default: '',
				description: 'Filter reports until this date',
			},
			{
				displayName: 'Sender Name',
				name: 'sender_name',
				type: 'string',
				default: '',
				description: 'Filter by sender name',
			},
		],
	},

	/* -------------------------------------------------------------------------- */
	/*                                report:get                                */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Report ID',
		name: 'reportId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['report'],
				operation: ['get'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the report to retrieve',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['report'],
				operation: ['get'],
			},
		},
		options: [
			{
				displayName: 'Start Date',
				name: 'start_date',
				type: 'dateTime',
				default: '',
				description: 'Filter report from this date',
			},
			{
				displayName: 'End Date',
				name: 'end_date',
				type: 'dateTime',
				default: '',
				description: 'Filter report until this date',
			},
			{
				displayName: 'Sender Name',
				name: 'sender_name',
				type: 'string',
				default: '',
				description: 'Filter by sender name',
			},
		],
	},
];

export const senderNameOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['senderName'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new sender name',
				action: 'Create a sender name',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a sender name',
				action: 'Get a sender name',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Get all sender names',
				action: 'Get all sender names',
			},
		],
		default: 'create',
	},
];

export const senderNameFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                senderName:create                          */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['senderName'],
				operation: ['create'],
			},
		},
		default: '',
		required: true,
		description: 'The sender name (max 11 characters, alphanumeric only)',
		placeholder: 'YourBrand',
	},

	/* -------------------------------------------------------------------------- */
	/*                                senderName:get                            */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Sender Name ID',
		name: 'senderNameId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['senderName'],
				operation: ['get'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the sender name to retrieve',
	},

	/* -------------------------------------------------------------------------- */
	/*                                senderName:getAll                         */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['senderName'],
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
				resource: ['senderName'],
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
				resource: ['senderName'],
				operation: ['getAll'],
			},
		},
		options: [
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
];