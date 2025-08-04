import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	IDataObject,
	NodeConnectionType,
	ILoadOptionsFunctions,
	INodePropertyOptions,
} from 'n8n-workflow';

import {
	nimbaSmsApiRequest,
	nimbaSmsApiRequestAllItems,
	validatePhoneNumber,
	formatPhoneNumber,
	validateMessage,
} from './GenericFunctions';

// Assurez-vous que tous ces imports existent et sont corrects
import { contactOperations, contactFields } from './descriptions/ContactDescription';
import { groupOperations, groupFields } from './descriptions/GroupDescription';
import { smsOperations, smsFields } from './descriptions/SmsDescription';
import { accountOperations, accountFields } from './descriptions/AccountDescription';

export class NimbaSMS implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Nimba SMS',
		name: 'nimbaSMS',
		icon: 'file:icons/nimbasms.svg',
		group: ['communication'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Send SMS, manage campaigns, and track delivery reports using the Nimba SMS API with ease.',
		defaults: {
			name: 'Nimba SMS',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'nimbaSmsApi',
				required: true,
			},
		],
		properties: [
			// Resource selector
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Message',
						value: 'message',
						description: 'Send and manage SMS',
					},
					{
						name: 'Contact',
						value: 'contact',
						description: 'Manage contacts',
					},
					{
						name: 'Group',
						value: 'group',
						description: 'Manage contact groups',
					},
					{
						name: 'Account',
						value: 'account',
						description: 'Account information and billing',
					},
					{
						name: 'Sender Name',
						value: 'senderName',
						description: 'Manage sender names',
					},
				],
				default: 'message',
			},

			// Message Operations
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
						name: 'Send SMS',
						value: 'send',
						description: 'Send an SMS message',
						action: 'Send an SMS message',
					},
					{
						name: 'Get All Messages',
						value: 'getAll',
						description: 'Get all SMS messages',
						action: 'Get all SMS messages',
					},
					{
						name: 'Get Message',
						value: 'get',
						description: 'Get a specific SMS message',
						action: 'Get a SMS message',
					},
				],
				default: 'send',
			},

			// Send SMS Fields
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
				description: 'The sender name to use for the SMS',
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
				description: 'The message content (max 665 characters)',
			},
			{
				displayName: 'Contacts',
				name: 'contact',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['send'],
					},
				},
				default: {},
				placeholder: 'Add Contact',
				options: [
					{
						name: 'contact',
						displayName: 'Contact',
						values: [
							{
								displayName: 'Phone Number',
								name: 'phoneNumber',
								type: 'string',
								default: '',
								required: true,
								placeholder: '+224622000000',
								description: 'Phone number in international format',
							},
						],
					},
				],
				description: 'List of phone numbers to send SMS to (max 50)',
			},

			// Spread other operations and fields
			...contactOperations,
			...contactFields,
			...groupOperations,
			...groupFields,
			...smsOperations,
			...smsFields,
			...accountOperations,
			...accountFields,
		],
	};

	methods = {
		loadOptions: {
			async getSenderNames(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					// Essayez d'abord de récupérer depuis l'API
					const responseData = await nimbaSmsApiRequest.call(this, 'GET', 'sendernames');
					
					if (responseData && responseData.results && Array.isArray(responseData.results)) {
						return responseData.results.map((senderName: any) => ({
							name: senderName.name || senderName.sender_name,
							value: senderName.name || senderName.sender_name,
						}));
					}
				} catch (error) {
					// Si l'API échoue, retourner des valeurs par défaut
					console.warn('Failed to load sender names from API, using defaults:', error);
				}

				// Valeurs par défaut
				return [
					{
						name: 'Nimba API',
						value: 'Nimba API',
					},
					{
						name: 'SMS',
						value: 'SMS',
					},
					{
						name: 'TEST',
						value: 'TEST',
					},
					{
						name: 'DEMO',
						value: 'DEMO',
					},
				];
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const length = items.length;
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < length; i++) {
			try {
				if (resource === 'message') {
					// SMS Operations
					if (operation === 'send') {
						const senderName = this.getNodeParameter('senderName', i) as string;
						const contactsData = this.getNodeParameter('contact', i) as IDataObject;
						const message = this.getNodeParameter('message', i) as string;

						// Extract phone numbers from the fixedCollection
						const contactList: string[] = [];
						if (contactsData.contact && Array.isArray(contactsData.contact)) {
							for (const contact of contactsData.contact as IDataObject[]) {
								if (contact.phoneNumber && typeof contact.phoneNumber === 'string') {
									contactList.push(contact.phoneNumber.trim());
								}
							}
						}
						
						if (contactList.length === 0) {
							throw new NodeOperationError(this.getNode(), 
								`No valid contacts provided. Please provide at least one phone number.`, { itemIndex: i });
						}

						if (contactList.length > 50) {
							throw new NodeOperationError(this.getNode(), 
								`Too many contacts. Maximum 50 contacts allowed.`, { itemIndex: i });
						}

						// Validate each phone number and format them
						const formattedContacts = contactList.map(contact => {
							if (!validatePhoneNumber(contact)) {
								throw new NodeOperationError(this.getNode(), 
									`Invalid phone number "${contact}". Please provide a valid phone number.`, { itemIndex: i });
							}
							return formatPhoneNumber(contact);
						});

						if (!validateMessage(message)) {
							throw new NodeOperationError(this.getNode(), 
								`Message too long. Maximum 665 characters allowed.`, { itemIndex: i });
						}

						const body: IDataObject = {
							sender_name: senderName,
							to: formattedContacts,
							message,
						};

						const responseData = await nimbaSmsApiRequest.call(this, 'POST', 'messages', body);
						returnData.push(responseData);

					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const qs: IDataObject = {};

						if (additionalFields.search) {
							qs.search = additionalFields.search;
						}
						if (additionalFields.status) {
							qs.status = additionalFields.status;
						}

						if (returnAll) {
							const responseData = await nimbaSmsApiRequestAllItems.call(this, 'results', 'GET', 'messages', {}, qs);
							returnData.push.apply(returnData, responseData);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							if (additionalFields.offset) {
								qs.offset = additionalFields.offset;
							}
							const responseData = await nimbaSmsApiRequest.call(this, 'GET', 'messages', {}, qs);
							returnData.push.apply(returnData, responseData.results || []);
						}

					} else if (operation === 'get') {
						const smsId = this.getNodeParameter('smsId', i) as string;
						const responseData = await nimbaSmsApiRequest.call(this, 'GET', `/messages/${smsId}`);
						returnData.push(responseData);
					}

				} else if (resource === 'contact') {
					// Contact Operations
					if (operation === 'create') {
						const numero = this.getNodeParameter('numero', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						if (!validatePhoneNumber(numero)) {
							throw new NodeOperationError(this.getNode(), 
								`Invalid phone number "${numero}". Please provide a valid phone number.`, { itemIndex: i });
						}

						const body: IDataObject = {
							numero: formatPhoneNumber(numero),
						};

						if (additionalFields.name) {
							body.name = additionalFields.name;
						}
						if (additionalFields.groups) {
							const groups = (additionalFields.groups as string).split(',').map(group => group.trim());
							body.groups = groups;
						}

						const responseData = await nimbaSmsApiRequest.call(this, 'POST', 'contacts', body);
						returnData.push(responseData);

					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;

						const qs: IDataObject = {};

						if (filters.search) {
							qs.search = filters.search;
						}

						if (returnAll) {
							const responseData = await nimbaSmsApiRequestAllItems.call(this, 'results', 'GET', 'contacts', {}, qs);
							returnData.push.apply(returnData, responseData);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							if (filters.offset) {
								qs.offset = filters.offset;
							}
							const responseData = await nimbaSmsApiRequest.call(this, 'GET', 'contacts', {}, qs);
							returnData.push.apply(returnData, responseData.results || []);
						}
					}

				} else if (resource === 'group') {
					// Group Operations
					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;

						const qs: IDataObject = {};

						if (filters.search) {
							qs.search = filters.search;
						}
						if (filters.ordering) {
							qs.ordering = filters.ordering;
						}

						if (returnAll) {
							const responseData = await nimbaSmsApiRequestAllItems.call(this, 'results', 'GET', 'groups', {}, qs);
							returnData.push.apply(returnData, responseData);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							if (filters.offset) {
								qs.offset = filters.offset;
							}
							const responseData = await nimbaSmsApiRequest.call(this, 'GET', 'groups', {}, qs);
							returnData.push.apply(returnData, responseData.results || []);
						}
					}

				} else if (resource === 'account') {
					// Account Operations
					if (operation === 'getBalance') {
						const responseData = await nimbaSmsApiRequest.call(this, 'GET', 'accounts');
						returnData.push(responseData);
					}

				} else if (resource === 'senderName') {
					// Sender Name Operations
					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const qs: IDataObject = {};

						if (returnAll) {
							const responseData = await nimbaSmsApiRequestAllItems.call(this, 'results', 'GET', 'sendernames', {}, qs);
							returnData.push.apply(returnData, responseData);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;  
							qs.limit = limit;
							if (additionalFields.offset) {
								qs.offset = additionalFields.offset;
							}
							const responseData = await nimbaSmsApiRequest.call(this, 'GET', 'sendernames', {}, qs);
							returnData.push.apply(returnData, responseData.results || []);
						}
					}
				}

			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ error: (error as Error).message });
					continue;
				}
				throw error;
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}