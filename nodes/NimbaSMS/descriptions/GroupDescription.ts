import { INodeProperties } from 'n8n-workflow';

export const groupOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['group'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new group',
				action: 'Create a group',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a group',
				action: 'Delete a group',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a group',
				action: 'Get a group',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Get all groups',
				action: 'Get all groups',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a group',
				action: 'Update a group',
			},
			{
				name: 'Assign Contacts',
				value: 'assignContacts',
				description: 'Assign contacts to a group',
				action: 'Assign contacts to group',
			},
			{
				name: 'Unassign Contacts',
				value: 'unassignContacts',
				description: 'Unassign contacts from a group',
				action: 'Unassign contacts from group',
			},
		],
		default: 'create',
	},
];

export const groupFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                group:create                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['create'],
			},
		},
		default: '',
		required: true,
		description: 'The group name (max 100 characters)',
		placeholder: 'My Contact Group',
	},

	/* -------------------------------------------------------------------------- */
	/*                                group:update                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Group ID',
		name: 'groupId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['update'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the group to update',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['update'],
			},
		},
		default: '',
		required: true,
		description: 'The new group name (max 100 characters)',
		placeholder: 'My Updated Group',
	},

	/* -------------------------------------------------------------------------- */
	/*                                group:get                                  */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Group ID',
		name: 'groupId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['get'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the group to retrieve',
	},

	/* -------------------------------------------------------------------------- */
	/*                                group:delete                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Group ID',
		name: 'groupId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['delete'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the group to delete',
	},

	/* -------------------------------------------------------------------------- */
	/*                                group:getAll                              */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['group'],
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
				resource: ['group'],
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
				resource: ['group'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Search term to filter groups',
			},
			{
				displayName: 'Ordering',
				name: 'ordering',
				type: 'string',
				default: '',
				description: 'Field to use when ordering the results',
				placeholder: 'name, -name, added_at, -added_at',
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
	/*                                group:assignContacts                      */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Group ID',
		name: 'groupId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['assignContacts'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the group to assign contacts to',
	},
	{
		displayName: 'Contact IDs',
		name: 'contactIds',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['assignContacts'],
			},
		},
		default: '',
		required: true,
		description: 'Comma-separated list of contact IDs to assign to the group',
		placeholder: '1,2,3,4',
	},

	/* -------------------------------------------------------------------------- */
	/*                                group:unassignContacts                    */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Group ID',
		name: 'groupId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['unassignContacts'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the group to unassign contacts from',
	},
	{
		displayName: 'Unassign Type',
		name: 'unassignType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['unassignContacts'],
			},
		},
		options: [
			{
				name: 'Specific Contacts',
				value: 'specific',
				description: 'Unassign specific contacts by ID',
			},
			{
				name: 'All Contacts',
				value: 'all',
				description: 'Unassign all contacts from the group',
			},
		],
		default: 'specific',
		description: 'Type of unassignment to perform',
	},
	{
		displayName: 'Contact IDs',
		name: 'contactIds',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['unassignContacts'],
				unassignType: ['specific'],
			},
		},
		default: '',
		required: true,
		description: 'Comma-separated list of contact IDs to unassign from the group',
		placeholder: '1,2,3,4',
	},
];