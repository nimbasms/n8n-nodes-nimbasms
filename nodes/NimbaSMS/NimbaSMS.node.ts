import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	IDataObject,
	NodeConnectionType,
} from 'n8n-workflow';

import {
	nimbaSmsApiRequest,
	nimbaSmsApiRequestAllItems,
	validatePhoneNumber,
	formatPhoneNumber,
	validateSenderName,
	validateMessage,
} from './GenericFunctions';

import { contactOperations, contactFields } from './descriptions/ContactDescription';
import { groupOperations, groupFields } from './descriptions/GroupDescription';
import { smsOperations, smsFields } from './descriptions/SmsDescription';
import { campaignOperations, campaignFields } from './descriptions/CampaignDescription';
import { accountOperations, accountFields } from './descriptions/AccountDescription';
import { reportOperations, reportFields, senderNameOperations, senderNameFields } from './descriptions/ReportDescription';

export class NimbaSMS implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Nimba SMS',
		name: 'nimbaSMS',
		icon: 'file:nimbasms.svg',
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
						name: 'SMS',
						value: 'sms',
						description: 'Send and manage SMS',
					},
					{
						name: 'Campaign',
						value: 'campaign',
						description: 'Manage SMS campaigns',
					},
					{
						name: 'Account',
						value: 'account',
						description: 'Account information and billing',
					},
					{
						name: 'Report',
						value: 'report',
						description: 'View reports and analytics',
					},
					{
						name: 'Sender Name',
						value: 'senderName',
						description: 'Manage sender names',
					},
				],
				default: 'sms',
			},
			...contactOperations,
			...contactFields,
			...groupOperations,
			...groupFields,
			...smsOperations,
			...smsFields,
			...campaignOperations,
			...campaignFields,
			...accountOperations,
			...accountFields,
			...reportOperations,
			...reportFields,
			...senderNameOperations,
			...senderNameFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const length = items.length;
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < length; i++) {
			try {
				if (resource === 'sms') {
					// SMS Operations
					if (operation === 'send') {
						const senderName = this.getNodeParameter('senderName', i) as string;
						const contact = this.getNodeParameter('contact', i) as string;
						const message = this.getNodeParameter('message', i) as string;

						// Validation
						if (!validateSenderName(senderName)) {
							throw new NodeOperationError(this.getNode(), 
								`Invalid sender name "${senderName}". Must be max 11 alphanumeric characters.`, { itemIndex: i });
						}

						if (!validatePhoneNumber(contact)) {
							throw new NodeOperationError(this.getNode(), 
								`Invalid phone number "${contact}". Please provide a valid phone number.`, { itemIndex: i });
						}

						if (!validateMessage(message)) {
							throw new NodeOperationError(this.getNode(), 
								`Message too long. Maximum 665 characters allowed.`, { itemIndex: i });
						}

						const body: IDataObject = {
							sender_name: senderName,
							contact: formatPhoneNumber(contact),
							message,
						};

						const responseData = await nimbaSmsApiRequest.call(this, 'POST', '/v1/sms', body);
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
							const responseData = await nimbaSmsApiRequestAllItems.call(this, 'results', 'GET', '/v1/sms', {}, qs);
							returnData.push.apply(returnData, responseData);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							if (additionalFields.offset) {
								qs.offset = additionalFields.offset;
							}
							const responseData = await nimbaSmsApiRequest.call(this, 'GET', '/v1/sms', {}, qs);
							returnData.push.apply(returnData, responseData.results || []);
						}

					} else if (operation === 'get') {
						const smsId = this.getNodeParameter('smsId', i) as string;
						const responseData = await nimbaSmsApiRequest.call(this, 'GET', `/v1/sms/${smsId}`);
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
						if (additionalFields.groupes_id) {
							const groupIds = (additionalFields.groupes_id as string).split(',').map(id => parseInt(id.trim()));
							body.groupes_id = groupIds;
						}
						if (additionalFields.birthday_date) {
							body.birthday_date = additionalFields.birthday_date;
						}
						if (additionalFields.birthday_message) {
							body.birthday_message = additionalFields.birthday_message;
						}
						if (additionalFields.birthday_sendername) {
							body.birthday_sendername = additionalFields.birthday_sendername;
						}

						const responseData = await nimbaSmsApiRequest.call(this, 'POST', '/v1/contacts/', body);
						returnData.push(responseData);

					} else if (operation === 'update') {
						const contactId = this.getNodeParameter('contactId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {};

						if (updateFields.name) {
							body.name = updateFields.name;
						}
						if (updateFields.numero) {
							if (!validatePhoneNumber(updateFields.numero as string)) {
								throw new NodeOperationError(this.getNode(), 
									`Invalid phone number "${updateFields.numero}". Please provide a valid phone number.`, { itemIndex: i });
							}
							body.numero = formatPhoneNumber(updateFields.numero as string);
						}
						if (updateFields.groupes_id) {
							const groupIds = (updateFields.groupes_id as string).split(',').map(id => parseInt(id.trim()));
							body.groupes_id = groupIds;
						}
						if (updateFields.birthday_date) {
							body.birthday_date = updateFields.birthday_date;
						}
						if (updateFields.birthday_message) {
							body.birthday_message = updateFields.birthday_message;
						}
						if (updateFields.birthday_sendername) {
							body.birthday_sendername = updateFields.birthday_sendername;
						}

						const responseData = await nimbaSmsApiRequest.call(this, 'PATCH', `/v1/contacts/${contactId}`, body);
						returnData.push(responseData);

					} else if (operation === 'get') {
						const contactId = this.getNodeParameter('contactId', i) as string;
						const responseData = await nimbaSmsApiRequest.call(this, 'GET', `/v1/contacts/${contactId}`);
						returnData.push(responseData);

					} else if (operation === 'delete') {
						const contactId = this.getNodeParameter('contactId', i) as string;
						await nimbaSmsApiRequest.call(this, 'DELETE', `/v1/contacts/${contactId}`);
						returnData.push({ success: true, id: contactId });

					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;

						const qs: IDataObject = {};

						if (filters.groupes__id) {
							qs.groupes__id = filters.groupes__id;
						}
						if (filters.search) {
							qs.search = filters.search;
						}

						if (returnAll) {
							const responseData = await nimbaSmsApiRequestAllItems.call(this, 'results', 'GET', '/v1/contacts/', {}, qs);
							returnData.push.apply(returnData, responseData);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							if (filters.offset) {
								qs.offset = filters.offset;
							}
							const responseData = await nimbaSmsApiRequest.call(this, 'GET', '/v1/contacts/', {}, qs);
							returnData.push.apply(returnData, responseData.results || []);
						}

					} else if (operation === 'bulkDelete') {
						const contactIds = this.getNodeParameter('contactIds', i) as string;
						const contactIdArray = contactIds.split(',').map(id => parseInt(id.trim()));

						const body: IDataObject = {
							contact_ids: contactIdArray,
						};

						const responseData = await nimbaSmsApiRequest.call(this, 'PATCH', '/v1/contacts/bulk_delete', body);
						returnData.push(responseData);

					} else if (operation === 'upload') {
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
						const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);

						const formData = {
							file_uploaded: {
								value: Buffer.from(binaryData.data, 'base64'),
								options: {
									filename: binaryData.fileName || 'contacts.csv',
									contentType: binaryData.mimeType || 'text/csv',
								},
							},
						};

						const responseData = await nimbaSmsApiRequest.call(this, 'POST', '/v1/contacts/uploads', {}, {}, undefined, { formData });
						returnData.push(responseData);
					}

				} else if (resource === 'group') {
					// Group Operations
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;

						const body: IDataObject = {
							name,
						};

						const responseData = await nimbaSmsApiRequest.call(this, 'POST', '/v1/groups/', body);
						returnData.push(responseData);

					} else if (operation === 'update') {
						const groupId = this.getNodeParameter('groupId', i) as string;
						const name = this.getNodeParameter('name', i) as string;

						const body: IDataObject = {
							name,
						};

						const responseData = await nimbaSmsApiRequest.call(this, 'PUT', `/v1/groups/${groupId}`, body);
						returnData.push(responseData);

					} else if (operation === 'get') {
						const groupId = this.getNodeParameter('groupId', i) as string;
						const responseData = await nimbaSmsApiRequest.call(this, 'GET', `/v1/groups/${groupId}`);
						returnData.push(responseData);

					} else if (operation === 'delete') {
						const groupId = this.getNodeParameter('groupId', i) as string;
						await nimbaSmsApiRequest.call(this, 'DELETE', `/v1/groups/${groupId}`);
						returnData.push({ success: true, id: groupId });

					} else if (operation === 'getAll') {
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
							const responseData = await nimbaSmsApiRequestAllItems.call(this, 'results', 'GET', '/v1/groups/', {}, qs);
							returnData.push.apply(returnData, responseData);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							if (filters.offset) {
								qs.offset = filters.offset;
							}
							const responseData = await nimbaSmsApiRequest.call(this, 'GET', '/v1/groups/', {}, qs);
							returnData.push.apply(returnData, responseData.results || []);
						}

					} else if (operation === 'assignContacts') {
						const groupId = this.getNodeParameter('groupId', i) as string;
						const contactIds = this.getNodeParameter('contactIds', i) as string;
						const contactIdArray = contactIds.split(',').map(id => parseInt(id.trim()));

						const body: IDataObject = {
							contact_ids: contactIdArray,
							group_ids: [parseInt(groupId)],
						};

						const responseData = await nimbaSmsApiRequest.call(this, 'POST', '/v1/contacts/assign-groups-contacts', body);
						returnData.push(responseData);

					} else if (operation === 'unassignContacts') {
						const groupId = this.getNodeParameter('groupId', i) as string;
						const unassignType = this.getNodeParameter('unassignType', i) as string;

						if (unassignType === 'specific') {
							const contactIds = this.getNodeParameter('contactIds', i) as string;
							const contactIdArray = contactIds.split(',').map(id => parseInt(id.trim()));

							const body: IDataObject = {
								contact_ids: contactIdArray,
							};

							const responseData = await nimbaSmsApiRequest.call(this, 'PUT', `/v1/groups/${groupId}/unassing-contacts`, body);
							returnData.push(responseData);
						} else {
							const responseData = await nimbaSmsApiRequest.call(this, 'PUT', `/v1/groups/${groupId}/unassing-all-contacts`, {});
							returnData.push(responseData);
						}
					}

				} else if (resource === 'campaign') {
					// Campaign Operations
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const senderName = this.getNodeParameter('senderName', i) as string;
						const message = this.getNodeParameter('message', i) as string;
						const groupsIds = this.getNodeParameter('groupsIds', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						// Validation
						if (!validateSenderName(senderName)) {
							throw new NodeOperationError(this.getNode(), 
								`Invalid sender name "${senderName}". Must be max 18 characters alphanumeric.`, { itemIndex: i });
						}

						if (!validateMessage(message)) {
							throw new NodeOperationError(this.getNode(), 
								`Message too long. Maximum 665 characters allowed.`, { itemIndex: i });
						}

						const groupIdArray = groupsIds.split(',').map(id => parseInt(id.trim()));

						const body: IDataObject = {
							name,
							sender_name: senderName,
							message,
							groups_ids: groupIdArray,
						};

						if (additionalFields.plannedAt) {
							body.planned_at = additionalFields.plannedAt;
						}

						const responseData = await nimbaSmsApiRequest.call(this, 'POST', '/v1/campaigns', body);
						returnData.push(responseData);

					} else if (operation === 'update') {
						const campaignId = this.getNodeParameter('campaignId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {};

						if (updateFields.name) {
							body.name = updateFields.name;
						}
						if (updateFields.senderName) {
							if (!validateSenderName(updateFields.senderName as string)) {
								throw new NodeOperationError(this.getNode(), 
									`Invalid sender name "${updateFields.senderName}". Must be max 18 characters alphanumeric.`, { itemIndex: i });
							}
							body.sender_name = updateFields.senderName;
						}
						if (updateFields.message) {
							if (!validateMessage(updateFields.message as string)) {
								throw new NodeOperationError(this.getNode(), 
									`Message too long. Maximum 665 characters allowed.`, { itemIndex: i });
							}
							body.message = updateFields.message;
						}
						if (updateFields.groupsIds) {
							const groupIdArray = (updateFields.groupsIds as string).split(',').map(id => parseInt(id.trim()));
							body.groups_ids = groupIdArray;
						}
						if (updateFields.plannedAt) {
							body.planned_at = updateFields.plannedAt;
						}

						const responseData = await nimbaSmsApiRequest.call(this, 'PATCH', `/v1/campaigns/${campaignId}`, body);
						returnData.push(responseData);

					} else if (operation === 'get') {
						const campaignId = this.getNodeParameter('campaignId', i) as string;
						const responseData = await nimbaSmsApiRequest.call(this, 'GET', `/v1/campaigns/${campaignId}`);
						returnData.push(responseData);

					} else if (operation === 'delete') {
						const campaignId = this.getNodeParameter('campaignId', i) as string;
						await nimbaSmsApiRequest.call(this, 'DELETE', `/v1/campaigns/${campaignId}`);
						returnData.push({ success: true, id: campaignId });

					} else if (operation === 'stop') {
						const campaignId = this.getNodeParameter('campaignId', i) as string;
						
						const body: IDataObject = {
							id: campaignId,
						};

						const responseData = await nimbaSmsApiRequest.call(this, 'POST', `/v1/campaigns/${campaignId}/stop`, body);
						returnData.push(responseData);

					} else if (operation === 'getNumbers') {
						const campaignId = this.getNodeParameter('campaignId', i) as string;
						const responseData = await nimbaSmsApiRequest.call(this, 'GET', `/v1/campaigns/${campaignId}/numbers`);
						returnData.push(responseData);

					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;

						const qs: IDataObject = {};

						if (filters.search) {
							qs.search = filters.search;
						}

						if (returnAll) {
							const responseData = await nimbaSmsApiRequestAllItems.call(this, 'results', 'GET', '/v1/campaigns', {}, qs);
							returnData.push.apply(returnData, responseData);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							if (filters.offset) {
								qs.offset = filters.offset;
							}
							const responseData = await nimbaSmsApiRequest.call(this, 'GET', '/v1/campaigns', {}, qs);
							returnData.push.apply(returnData, responseData.results || []);
						}
					}

				} else if (resource === 'account') {
					// Account Operations
					if (operation === 'getBalance') {
						const responseData = await nimbaSmsApiRequest.call(this, 'GET', '/v1/balance');
						returnData.push(responseData);

					} else if (operation === 'getPacks') {
						const responseData = await nimbaSmsApiRequest.call(this, 'GET', '/v1/packs');
						returnData.push.apply(returnData, Array.isArray(responseData) ? responseData : [responseData]);

					} else if (operation === 'getPurchases') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const qs: IDataObject = {};

						if (returnAll) {
							const responseData = await nimbaSmsApiRequestAllItems.call(this, 'results', 'GET', '/v1/purchases', {}, qs);
							returnData.push.apply(returnData, responseData);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							if (additionalFields.offset) {
								qs.offset = additionalFields.offset;
							}
							const responseData = await nimbaSmsApiRequest.call(this, 'GET', '/v1/purchases', {}, qs);
							returnData.push.apply(returnData, responseData.results || []);
						}

					} else if (operation === 'getConsumptions') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const qs: IDataObject = {};

						if (returnAll) {
							const responseData = await nimbaSmsApiRequestAllItems.call(this, 'results', 'GET', '/v1/auth/users/postpaid-consumptions', {}, qs);
							returnData.push.apply(returnData, responseData);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							if (additionalFields.offset) {
								qs.offset = additionalFields.offset;
							}
							const responseData = await nimbaSmsApiRequest.call(this, 'GET', '/v1/auth/users/postpaid-consumptions', {}, qs);
							returnData.push.apply(returnData, responseData.results || []);
						}
					}

				} else if (resource === 'report') {
					// Report Operations
					if (operation === 'getAll') {
						const filters = this.getNodeParameter('filters', i) as IDataObject;

						const qs: IDataObject = {};

						if (filters.start_date) {
							qs.start_date = filters.start_date;
						}
						if (filters.end_date) {
							qs.end_date = filters.end_date;
						}
						if (filters.sender_name) {
							qs.sender_name = filters.sender_name;
						}

						const responseData = await nimbaSmsApiRequest.call(this, 'GET', '/v1/reports/', {}, qs);
						returnData.push.apply(returnData, Array.isArray(responseData) ? responseData : [responseData]);

					} else if (operation === 'get') {
						const reportId = this.getNodeParameter('reportId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const qs: IDataObject = {};

						if (additionalFields.start_date) {
							qs.start_date = additionalFields.start_date;
						}
						if (additionalFields.end_date) {
							qs.end_date = additionalFields.end_date;
						}
						if (additionalFields.sender_name) {
							qs.sender_name = additionalFields.sender_name;
						}

						const responseData = await nimbaSmsApiRequest.call(this, 'GET', `/v1/reports/${reportId}/`, {}, qs);
						returnData.push(responseData);
					}

				} else if (resource === 'senderName') {
					// Sender Name Operations
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;

						// Validation
						if (!validateSenderName(name)) {
							throw new NodeOperationError(this.getNode(), 
								`Invalid sender name "${name}". Must be max 11 alphanumeric characters.`, { itemIndex: i });
						}

						const body: IDataObject = {
							name,
						};

						const responseData = await nimbaSmsApiRequest.call(this, 'POST', '/v1/senders-names/', body);
						returnData.push(responseData);

					} else if (operation === 'get') {
						const senderNameId = this.getNodeParameter('senderNameId', i) as string;
						const responseData = await nimbaSmsApiRequest.call(this, 'GET', `/v1/senders-names/${senderNameId}/`);
						returnData.push(responseData);

					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const qs: IDataObject = {};

						if (returnAll) {
							const responseData = await nimbaSmsApiRequestAllItems.call(this, 'results', 'GET', '/v1/senders-names/', {}, qs);
							returnData.push.apply(returnData, responseData);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							if (additionalFields.offset) {
								qs.offset = additionalFields.offset;
							}
							const responseData = await nimbaSmsApiRequest.call(this, 'GET', '/v1/senders-names/', {}, qs);
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