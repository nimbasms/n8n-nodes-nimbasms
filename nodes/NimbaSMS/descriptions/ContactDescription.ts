import { INodeProperties } from 'n8n-workflow';

export const contactOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['contact'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new contact',
				action: 'Create a contact',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a contact',
				action: 'Delete a contact',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a contact',
				action: 'Get a contact',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Get all contacts',
				action: 'Get all contacts',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a contact',
				action: 'Update a contact',
			},
			{
				name: 'Bulk Delete',
				value: 'bulkDelete',
				description: 'Delete multiple contacts',
				action: 'Bulk delete contacts',
			},
			{
				name: 'Upload',
				value: 'upload',
				description: 'Upload contacts from file',
				action: 'Upload contacts',
			},
		],
		default: 'create',
	},
];

export const contactFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                contact:create                             */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Phone Number',
		name: 'numero',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create'],
			},
		},
		default: '',
		required: true,
		description: 'The contact phone number',
		placeholder: '+224123456789',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The contact name',
			},
			{
				displayName: 'Group IDs',
				name: 'groupes_id',
				type: 'string',
				default: '',
				description: 'Comma-separated list of group IDs to assign the contact to',
				placeholder: '1,2,3',
			},
			{
				displayName: 'Birthday Date',
				name: 'birthday_date',
				type: 'dateTime',
				default: '',
				description: 'Contact birthday date',
			},
			{
				displayName: 'Birthday Message',
				name: 'birthday_message',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				default: '',
				description: 'Automatic birthday message to send',
			},
			{
				displayName: 'Birthday Sender Name',
				name: 'birthday_sendername',
				type: 'string',
				default: '',
				description: 'Sender name for birthday messages (max 11 characters)',
			},
		],
	},

	/* -------------------------------------------------------------------------- */
	/*                                contact:update                             */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['update'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the contact to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The contact name',
			},
			{
				displayName: 'Phone Number',
				name: 'numero',
				type: 'string',
				default: '',
				description: 'The contact phone number',
			},
			{
				displayName: 'Group IDs',
				name: 'groupes_id',
				type: 'string',
				default: '',
				description: 'Comma-separated list of group IDs',
				placeholder: '1,2,3',
			},
			{
				displayName: 'Birthday Date',
				name: 'birthday_date',
				type: 'dateTime',
				default: '',
				description: 'Contact birthday date',
			},
			{
				displayName: 'Birthday Message',
				name: 'birthday_message',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				default: '',
				description: 'Automatic birthday message to send',
			},
			{
				displayName: 'Birthday Sender Name',
				name: 'birthday_sendername',
				type: 'string',
				default: '',
				description: 'Sender name for birthday messages (max 11 characters)',
			},
		],
	},

	/* -------------------------------------------------------------------------- */
	/*                                contact:get                                */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['get'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the contact to retrieve',
	},

	/* -------------------------------------------------------------------------- */
	/*                                contact:delete                             */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['delete'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the contact to delete',
	},

	/* -------------------------------------------------------------------------- */
	/*                                contact:getAll                            */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['contact'],
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
				resource: ['contact'],
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
				resource: ['contact'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Group ID',
				name: 'groupes__id',
				type: 'string',
				default: '',
				description: 'Filter contacts by group ID',
			},
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Search term to filter contacts',
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
	/*                                contact:bulkDelete                        */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Contact IDs',
		name: 'contactIds',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['bulkDelete'],
			},
		},
		default: '',
		required: true,
		description: 'Comma-separated list of contact IDs to delete',
		placeholder: '1,2,3,4',
	},

	/* -------------------------------------------------------------------------- */
	/*                                contact:upload                            */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['upload'],
			},
		},
		required: true,
		description: 'Name of the binary property containing the file to upload',
	},
];