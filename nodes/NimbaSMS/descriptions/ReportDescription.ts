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
				name: 'Get All',
				value: 'getAll',
				description: 'Get all sender names',
				action: 'Get all sender names',
			},
		],
		default: 'getAll',
	},
];

export const senderNameFields: INodeProperties[] = [

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