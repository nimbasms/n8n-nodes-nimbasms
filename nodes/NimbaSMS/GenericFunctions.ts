import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IDataObject,
	IHttpRequestMethods,
	IRequestOptions,
	NodeApiError,
	JsonObject,
} from 'n8n-workflow';

export async function nimbaSmsApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	resource: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	uri?: string,
	option: IDataObject = {},
): Promise<any> {
	const credentials = await this.getCredentials('nimbaSmsApi');

	let options: IRequestOptions = {
		headers: {
			'Content-Type': 'application/json',
		},
		method,
		qs,
		body,
		uri: uri || `https://api.nimbasms.com/v1/${resource}`,
		json: true,
		auth: {
			user: credentials.serviceId as string,
			password: credentials.secretToken as string,
		},
	};

	options = Object.assign({}, options, option);

	if (Object.keys(body).length === 0) {
		delete options.body;
	}

	try {
		return await this.helpers.request(options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export async function nimbaSmsApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	propertyName: string,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
): Promise<any> {
	const returnData: IDataObject[] = [];

	let responseData;
	query.limit = 100;
	query.offset = 0;

	do {
		responseData = await nimbaSmsApiRequest.call(this, method, endpoint, body, query);

		if (responseData[propertyName]) {
			returnData.push.apply(returnData, responseData[propertyName]);
		}

		query.offset = (query.offset as number) + (query.limit as number);
	} while (responseData.next);

	return returnData;
}

export function validateEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

export function validatePhoneNumber(phone: string): boolean {
	// Remove all non-digit characters
	const cleanPhone = phone.replace(/\D/g, '');
	// Check if it's a valid Guinea phone number (8-18 digits)
	return cleanPhone.length >= 8 && cleanPhone.length <= 18;
}

export function formatPhoneNumber(phone: string): string {
	// Remove all non-digit characters except +
	let cleanPhone = phone.replace(/[^\d+]/g, '');


	return cleanPhone;
}

export function validateSenderName(senderName: string): boolean {
	return senderName.length <= 11 && /^[a-zA-Z0-9]+$/.test(senderName);
}

export function validateMessage(message: string): boolean {
	return message.length <= 665;
}

export interface IPaginationOptions {
	limit?: number;
	offset?: number;
	returnAll?: boolean;
}

export function preparePaginationQuery(options: IPaginationOptions): IDataObject {
	const query: IDataObject = {};

	if (options.returnAll) {
		query.limit = 100;
		query.offset = 0;
	} else {
		query.limit = options.limit || 50;
		query.offset = options.offset || 0;
	}

	return query;
}
