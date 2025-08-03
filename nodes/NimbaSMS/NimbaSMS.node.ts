import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	IDataObject,
	NodeConnectionType,
	INodePropertyOptions,
} from 'n8n-workflow';

import {
	nimbaSmsApiRequest,
	nimbaSmsApiRequestAllItems,
	validatePhoneNumber,
	formatPhoneNumber,
	validateMessage,
} from './GenericFunctions';

import { contactOperations, contactFields } from './descriptions/ContactDescription';
import { groupOperations, groupFields } from './descriptions/GroupDescription';
import { smsOperations, smsFields } from './descriptions/SmsDescription';
import { accountOperations, accountFields } from './descriptions/AccountDescription';
import { senderNameOperations, senderNameFields } from './descriptions/ReportDescription';

export class NimbaSMS implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Nimba SMS',
		name: 'nimbaSMS',
		icon: 'file:icons/nimbasms.svg',
		group: ['communication'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Nimba SMS API',
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
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
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
						name: 'Message',
						value: 'message',
						description: 'Send and manage SMS',
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
			...contactOperations,
			...contactFields,
			...groupOperations,
			...groupFields,
			...smsOperations,
			...smsFields,
			...accountOperations,
			...accountFields,
			...senderNameOperations,
			...senderNameFields,
		],
	};

	async getSenderNames(this: IExecuteFunctions): Promise<INodePropertyOptions[]> {
		console.log('getSenderNames method called');
		const returnData: INodePropertyOptions[] = [];
		
		try {
			console.log('Getting credentials...');
			const credentials = await this.getCredentials('nimbaSmsApi');
			console.log('Credentials obtained:', !!credentials);
			
			const baseUrl = credentials.baseUrl as string;
			const apiKey = credentials.apiKey as string;
			
			console.log('Making API request to:', `${baseUrl}/sendernames`);
			const response = await this.helpers.httpRequest({
				method: 'GET',
				url: `${baseUrl}/sendernames`,
				headers: {
					'Authorization': `Bearer ${apiKey}`,
					'Content-Type': 'application/json',
				},
			});
			
			console.log('API response received:', !!response);
			
			if (response.results && Array.isArray(response.results)) {
				console.log('Processing results, count:', response.results.length);
				for (const senderName of response.results) {
					if (senderName.status === 'accepted') {
						returnData.push({
							name: senderName.name,
							value: senderName.name,
						});
					}
				}
				console.log('Filtered results count:', returnData.length);
			}
		} catch (error) {
			console.error('Error in getSenderNames:', error);
			// If API call fails, return empty array
			return [];
		}
		
		console.log('Returning data:', returnData.length, 'items');
		return returnData;
	}

	async testMethod(this: IExecuteFunctions): Promise<INodePropertyOptions[]> {
		console.log('testMethod called');
		return [
			{
				name: 'Test Option',
				value: 'test',
			},
		];
	}

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