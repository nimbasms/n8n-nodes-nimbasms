import { INodeProperties } from 'n8n-workflow';

export const campaignOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['campaign'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new campaign',
				action: 'Create a campaign',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a campaign',
				action: 'Delete a campaign',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a campaign',
				action: 'Get a campaign',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Get all campaigns',
				action: 'Get all campaigns',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a campaign',
				action: 'Update a campaign',
			},
			{
				name: 'Stop',
				value: 'stop',
				description: 'Stop a running campaign',
				action: 'Stop a campaign',
			},
			{
				name: 'Get Numbers',
				value: 'getNumbers',
				description: 'Get campaign numbers and their status',
				action: 'Get campaign numbers',
			},
		],
		default: 'create',
	},
];

export const campaignFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                campaign:create                            */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['create'],
			},
		},
		default: '',
		required: true,
		description: 'The campaign name (max 100 characters)',
		placeholder: 'My SMS Campaign',
	},
	{
		displayName: 'Sender Name',
		name: 'senderName',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['create'],
			},
		},
		default: '',
		required: true,
		description: 'The sender name (max 18 characters)',
		placeholder: 'YourBrand',
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
				resource: ['campaign'],
				operation: ['create'],
			},
		},
		default: '',
		required: true,
		description: 'The SMS message content (max 665 characters for concatenated SMS)',
		placeholder: 'Your campaign message here...',
	},
	{
		displayName: 'Group IDs',
		name: 'groupsIds',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['create'],
			},
		},
		default: '',
		required: true,
		description: 'Comma-separated list of group IDs to send the campaign to',
		placeholder: '1,2,3',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Planned At',
				name: 'plannedAt',
				type: 'dateTime',
				default: '',
				description: 'Schedule the campaign for a specific date and time',
			},
		],
	},

	/* -------------------------------------------------------------------------- */
	/*                                campaign:update                            */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Campaign ID',
		name: 'campaignId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['update'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the campaign to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The campaign name (max 100 characters)',
			},
			{
				displayName: 'Sender Name',
				name: 'senderName',
				type: 'string',
				default: '',
				description: 'The sender name (max 18 characters)',
			},
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'The SMS message content (max 665 characters)',
			},
			{
				displayName: 'Group IDs',
				name: 'groupsIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of group IDs',
				placeholder: '1,2,3',
			},
			{
				displayName: 'Planned At',
				name: 'plannedAt',
				type: 'dateTime',
				default: '',
				description: 'Schedule the campaign for a specific date and time',
			},
		],
	},

	/* -------------------------------------------------------------------------- */
	/*                                campaign:get                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Campaign ID',
		name: 'campaignId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['get'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the campaign to retrieve',
	},

	/* -------------------------------------------------------------------------- */
	/*                                campaign:delete                            */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Campaign ID',
		name: 'campaignId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['delete'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the campaign to delete',
	},

	/* -------------------------------------------------------------------------- */
	/*                                campaign:stop                              */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Campaign ID',
		name: 'campaignId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['stop'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the campaign to stop',
	},

	/* -------------------------------------------------------------------------- */
	/*                                campaign:getNumbers                       */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Campaign ID',
		name: 'campaignId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['getNumbers'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the campaign to get numbers for',
	},

	/* -------------------------------------------------------------------------- */
	/*                                campaign:getAll                           */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['campaign'],
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
				resource: ['campaign'],
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
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Search term to filter campaigns',
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
];