import { INodeProperties } from 'n8n-workflow';

export const purchaseOperations: INodeProperties[] = [
	{
		displayName: 'Purchase Operation',
		name: 'purchaseOperation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['purchase'],
			},
		},
		options: [
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Get all purchase history',
				action: 'Get all purchases',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a specific purchase',
				action: 'Get a purchase',
			},
		],
		default: 'getAll',
	},
];

export const purchaseFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                purchase:getAll                             */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['purchase'],
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
				resource: ['purchase'],
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
				resource: ['purchase'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Payment Type',
				name: 'payment_type',
				type: 'options',
				options: [
					{
						name: 'Orange Money',
						value: 'Orange',
					},
					{
						name: 'MTN Mobile Money',
						value: 'MTN',
					},
					{
						name: 'Moov Money',
						value: 'Moov',
					},
					{
						name: 'Bank Transfer',
						value: 'Bank',
					},
					{
						name: 'Card Payment',
						value: 'Card',
					},
				],
				default: '',
				description: 'Filter by payment type',
			},
			{
				displayName: 'Start Date',
				name: 'start_date',
				type: 'dateTime',
				default: '',
				description: 'Filter purchases from this date',
			},
			{
				displayName: 'End Date',
				name: 'end_date',
				type: 'dateTime',
				default: '',
				description: 'Filter purchases until this date',
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
	/*                                purchase:get                                */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Purchase UID',
		name: 'purchaseUid',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['purchase'],
				operation: ['get'],
			},
		},
		default: '',
		required: true,
		description: 'The UID of the purchase to retrieve',
		placeholder: '07cc67f4-45d6-494b-adac-09b5cbc7e2b5',
	},
]; 