import { NimbaSMS } from '../nodes/NimbaSMS/NimbaSMS.node';
import {
	IExecuteFunctions,
	INodeExecutionData,
	NodeOperationError,
} from 'n8n-workflow';
import * as GenericFunctions from '../nodes/NimbaSMS/GenericFunctions';

// Mock des fonctions génériques
jest.mock('../nodes/NimbaSMS/GenericFunctions');

const mockedGenericFunctions = GenericFunctions as jest.Mocked<typeof GenericFunctions>;

describe('NimbaSMS Node - Couverture Complète', () => {
	let nimbaSmsNode: NimbaSMS;
	let mockExecuteFunctions: jest.Mocked<IExecuteFunctions>;

	beforeEach(() => {
		nimbaSmsNode = new NimbaSMS();
		jest.clearAllMocks();

		// Mock IExecuteFunctions
		mockExecuteFunctions = {
			getInputData: jest.fn(),
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn(),
			getNode: jest.fn(),
			continueOnFail: jest.fn(),
			helpers: {
				returnJsonArray: jest.fn(),
			},
		} as unknown as jest.Mocked<IExecuteFunctions>;

		// Configuration par défaut
		mockExecuteFunctions.getInputData.mockReturnValue([{}] as INodeExecutionData[]);
		mockExecuteFunctions.continueOnFail.mockReturnValue(false);
		(mockExecuteFunctions.helpers.returnJsonArray as jest.Mock).mockImplementation((data: any) => data);
		mockExecuteFunctions.getNode.mockReturnValue({ name: 'Nimba SMS Test' } as any);
	});

	describe('Message Operations', () => {
		describe('send operation', () => {
			beforeEach(() => {
				mockedGenericFunctions.validatePhoneNumber.mockReturnValue(true);
				mockedGenericFunctions.formatPhoneNumber.mockImplementation((phone) => `+224${phone}`);
				mockedGenericFunctions.validateMessage.mockReturnValue(true);
			});

			it('devrait envoyer un SMS avec succès', async () => {
				const mockContactsData = {
					contact: [{ phoneNumber: '623000000' }],
				};

				mockExecuteFunctions.getNodeParameter
					.mockReturnValueOnce('message') // resource
					.mockReturnValueOnce('send') // operation
					.mockReturnValueOnce('TestSender') // senderName
					.mockReturnValueOnce(mockContactsData) // contact
					.mockReturnValueOnce('Test message'); // message

				const mockResponse = { id: 'sms-123', status: 'sent' };
				mockedGenericFunctions.nimbaSmsApiRequest.mockResolvedValue(mockResponse);

				const result = await nimbaSmsNode.execute.call(mockExecuteFunctions);

				expect(mockedGenericFunctions.nimbaSmsApiRequest).toHaveBeenCalledWith(
					'POST',
					'messages',
					{
						sender_name: 'TestSender',
						to: ['+224623000000'],
						message: 'Test message',
					},
				);
				expect(result).toEqual([[mockResponse]]);
			});

			it('devrait lancer une erreur pour aucun contact', async () => {
				mockExecuteFunctions.getNodeParameter
					.mockReturnValueOnce('message') // resource
					.mockReturnValueOnce('send') // operation
					.mockReturnValueOnce('TestSender') // senderName
					.mockReturnValueOnce({ contact: [] }) // contact vide
					.mockReturnValueOnce('Test message'); // message

				await expect(nimbaSmsNode.execute.call(mockExecuteFunctions)).rejects.toThrow(
					NodeOperationError,
				);
			});

			it('devrait lancer une erreur pour trop de contacts', async () => {
				const tooManyContacts = {
					contact: Array.from({ length: 51 }, (_, i) => ({ 
						phoneNumber: `62300${i.toString().padStart(4, '0')}` 
					})),
				};

				mockExecuteFunctions.getNodeParameter
					.mockReturnValueOnce('message') // resource
					.mockReturnValueOnce('send') // operation
					.mockReturnValueOnce('TestSender') // senderName
					.mockReturnValueOnce(tooManyContacts) // contact
					.mockReturnValueOnce('Test message'); // message

				await expect(nimbaSmsNode.execute.call(mockExecuteFunctions)).rejects.toThrow(
					NodeOperationError,
				);
			});

			it('devrait lancer une erreur pour numéro invalide', async () => {
				const mockContactsData = { contact: [{ phoneNumber: 'invalid' }] };

				mockExecuteFunctions.getNodeParameter
					.mockReturnValueOnce('message') // resource
					.mockReturnValueOnce('send') // operation
					.mockReturnValueOnce('TestSender') // senderName
					.mockReturnValueOnce(mockContactsData) // contact
					.mockReturnValueOnce('Test message'); // message

				mockedGenericFunctions.validatePhoneNumber.mockReturnValue(false);

				await expect(nimbaSmsNode.execute.call(mockExecuteFunctions)).rejects.toThrow(
					NodeOperationError,
				);
			});

			it('devrait lancer une erreur pour message trop long', async () => {
				const mockContactsData = { contact: [{ phoneNumber: '623000000' }] };

				mockExecuteFunctions.getNodeParameter
					.mockReturnValueOnce('message') // resource
					.mockReturnValueOnce('send') // operation
					.mockReturnValueOnce('TestSender') // senderName
					.mockReturnValueOnce(mockContactsData) // contact
					.mockReturnValueOnce('Very long message'); // message

				mockedGenericFunctions.validateMessage.mockReturnValue(false);

				await expect(nimbaSmsNode.execute.call(mockExecuteFunctions)).rejects.toThrow(
					NodeOperationError,
				);
			});
		});

		describe('verification operation', () => {
			it('devrait envoyer une vérification OTP', async () => {
				mockExecuteFunctions.getNodeParameter
					.mockReturnValueOnce('message') // resource
					.mockReturnValueOnce('verification') // operation
					.mockReturnValueOnce('TestSender') // senderNameVerification
					.mockReturnValueOnce('+224623000000') // to
					.mockReturnValueOnce('Code: <1234>') // message
					.mockReturnValueOnce({ expiry_time: 10, attempts: 5, code_length: 6 }); // additionalFields

				mockedGenericFunctions.validatePhoneNumber.mockReturnValue(true);
				mockedGenericFunctions.formatPhoneNumber.mockReturnValue('+224623000000');

				const mockResponse = { id: 'otp-123', status: 'sent' };
				mockedGenericFunctions.nimbaSmsApiRequest.mockResolvedValue(mockResponse);

				await nimbaSmsNode.execute.call(mockExecuteFunctions);

				expect(mockedGenericFunctions.nimbaSmsApiRequest).toHaveBeenCalledWith(
					'POST',
					'verifications',
					{
						to: '+224623000000',
						message: 'Code: <1234>',
						sender_name: 'TestSender',
						expiry_time: 10,
						attempts: 5,
						code_length: 6,
					},
				);
			});

			it('devrait lancer une erreur pour numéro invalide', async () => {
				mockExecuteFunctions.getNodeParameter
					.mockReturnValueOnce('message') // resource
					.mockReturnValueOnce('verification') // operation
					.mockReturnValueOnce('TestSender') // senderNameVerification
					.mockReturnValueOnce('invalid') // to
					.mockReturnValueOnce('Code: <1234>') // message
					.mockReturnValueOnce({}); // additionalFields

				mockedGenericFunctions.validatePhoneNumber.mockReturnValue(false);

				await expect(nimbaSmsNode.execute.call(mockExecuteFunctions)).rejects.toThrow(
					NodeOperationError,
				);
			});

			it('devrait lancer une erreur sans placeholder <1234>', async () => {
				mockExecuteFunctions.getNodeParameter
					.mockReturnValueOnce('message') // resource
					.mockReturnValueOnce('verification') // operation
					.mockReturnValueOnce('TestSender') // senderNameVerification
					.mockReturnValueOnce('+224623000000') // to
					.mockReturnValueOnce('Code sans placeholder') // message
					.mockReturnValueOnce({}); // additionalFields

				mockedGenericFunctions.validatePhoneNumber.mockReturnValue(true);

				await expect(nimbaSmsNode.execute.call(mockExecuteFunctions)).rejects.toThrow(
					NodeOperationError,
				);
			});

			it('devrait lancer une erreur pour message trop long', async () => {
				const longMessage = 'A'.repeat(150) + '<1234>';

				mockExecuteFunctions.getNodeParameter
					.mockReturnValueOnce('message') // resource
					.mockReturnValueOnce('verification') // operation
					.mockReturnValueOnce('TestSender') // senderNameVerification
					.mockReturnValueOnce('+224623000000') // to
					.mockReturnValueOnce(longMessage) // message
					.mockReturnValueOnce({}); // additionalFields

				mockedGenericFunctions.validatePhoneNumber.mockReturnValue(true);

				await expect(nimbaSmsNode.execute.call(mockExecuteFunctions)).rejects.toThrow(
					NodeOperationError,
				);
			});
		});

		describe('getAll operation', () => {
			it('devrait récupérer tous les SMS', async () => {
				mockExecuteFunctions.getNodeParameter
					.mockReturnValueOnce('message') // resource
					.mockReturnValueOnce('getAll') // operation
					.mockReturnValueOnce(true) // returnAll
					.mockReturnValueOnce({ search: 'test' }); // additionalFields

				const mockMessages = [{ id: '1' }, { id: '2' }];
				mockedGenericFunctions.nimbaSmsApiRequestAllItems.mockResolvedValue(mockMessages);

				await nimbaSmsNode.execute.call(mockExecuteFunctions);

				expect(mockedGenericFunctions.nimbaSmsApiRequestAllItems).toHaveBeenCalledWith(
					'results',
					'GET',
					'messages',
					{},
					{ search: 'test' },
				);
			});

			it('devrait récupérer un nombre limité de SMS', async () => {
				mockExecuteFunctions.getNodeParameter
					.mockReturnValueOnce('message') // resource
					.mockReturnValueOnce('getAll') // operation
					.mockReturnValueOnce(false) // returnAll
					.mockReturnValueOnce({ offset: 10 }) // additionalFields
					.mockReturnValueOnce(25); // limit

				const mockResponse = { results: [{ id: '1' }] };
				mockedGenericFunctions.nimbaSmsApiRequest.mockResolvedValue(mockResponse);

				await nimbaSmsNode.execute.call(mockExecuteFunctions);

				expect(mockedGenericFunctions.nimbaSmsApiRequest).toHaveBeenCalledWith(
					'GET',
					'messages',
					{},
					{ limit: 25, offset: 10 },
				);
			});
		});

		describe('get operation', () => {
			it('devrait récupérer un SMS spécifique', async () => {
				mockExecuteFunctions.getNodeParameter
					.mockReturnValueOnce('message') // resource
					.mockReturnValueOnce('get') // operation
					.mockReturnValueOnce('sms-123'); // smsId

				const mockSms = { id: 'sms-123' };
				mockedGenericFunctions.nimbaSmsApiRequest.mockResolvedValue(mockSms);

				await nimbaSmsNode.execute.call(mockExecuteFunctions);

				expect(mockedGenericFunctions.nimbaSmsApiRequest).toHaveBeenCalledWith(
					'GET',
					'/messages/sms-123',
				);
			});
		});
	});

	describe('Contact Operations', () => {
		describe('create operation', () => {
			it('devrait créer un contact avec succès', async () => {
				mockExecuteFunctions.getNodeParameter
					.mockReturnValueOnce('contact') // resource
					.mockReturnValueOnce('create') // operation
					.mockReturnValueOnce('623000000') // numero
					.mockReturnValueOnce({ name: 'John', groups: 'group1, group2' }); // additionalFields

				mockedGenericFunctions.validatePhoneNumber.mockReturnValue(true);
				mockedGenericFunctions.formatPhoneNumber.mockReturnValue('+224623000000');

				const mockResponse = { id: 'contact-123' };
				mockedGenericFunctions.nimbaSmsApiRequest.mockResolvedValue(mockResponse);

				await nimbaSmsNode.execute.call(mockExecuteFunctions);

				expect(mockedGenericFunctions.nimbaSmsApiRequest).toHaveBeenCalledWith(
					'POST',
					'contacts',
					{
						numero: '+224623000000',
						name: 'John',
						groups: ['group1', 'group2'],
					},
				);
			});

			it('devrait créer un contact sans champs additionnels', async () => {
				mockExecuteFunctions.getNodeParameter
					.mockReturnValueOnce('contact') // resource
					.mockReturnValueOnce('create') // operation
					.mockReturnValueOnce('623000000') // numero
					.mockReturnValueOnce({}); // additionalFields vide

				mockedGenericFunctions.validatePhoneNumber.mockReturnValue(true);
				mockedGenericFunctions.formatPhoneNumber.mockReturnValue('+224623000000');

				const mockResponse = { id: 'contact-123' };
				mockedGenericFunctions.nimbaSmsApiRequest.mockResolvedValue(mockResponse);

				await nimbaSmsNode.execute.call(mockExecuteFunctions);

				expect(mockedGenericFunctions.nimbaSmsApiRequest).toHaveBeenCalledWith(
					'POST',
					'contacts',
					{
						numero: '+224623000000',
					},
				);
			});
		});

		describe('getAll operation', () => {
			it('devrait récupérer tous les contacts', async () => {
				mockExecuteFunctions.getNodeParameter
					.mockReturnValueOnce('contact') // resource
					.mockReturnValueOnce('getAll') // operation
					.mockReturnValueOnce(true) // returnAll
					.mockReturnValueOnce({ search: 'john' }); // filters

				const mockContacts = [{ id: '1' }];
				mockedGenericFunctions.nimbaSmsApiRequestAllItems.mockResolvedValue(mockContacts);

				await nimbaSmsNode.execute.call(mockExecuteFunctions);

				expect(mockedGenericFunctions.nimbaSmsApiRequestAllItems).toHaveBeenCalledWith(
					'results',
					'GET',
					'contacts',
					{},
					{ search: 'john' },
				);
			});

			it('devrait récupérer un nombre limité de contacts', async () => {
				mockExecuteFunctions.getNodeParameter
					.mockReturnValueOnce('contact') // resource
					.mockReturnValueOnce('getAll') // operation
					.mockReturnValueOnce(false) // returnAll
					.mockReturnValueOnce({ offset: 5 }) // filters
					.mockReturnValueOnce(10); // limit

				const mockResponse = { results: [{ id: '1' }] };
				mockedGenericFunctions.nimbaSmsApiRequest.mockResolvedValue(mockResponse);

				await nimbaSmsNode.execute.call(mockExecuteFunctions);

				expect(mockedGenericFunctions.nimbaSmsApiRequest).toHaveBeenCalledWith(
					'GET',
					'contacts',
					{},
					{ limit: 10, offset: 5 },
				);
			});
		});
	});

	describe('Group Operations', () => {
		it('devrait récupérer tous les groupes', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('group') // resource
				.mockReturnValueOnce('getAll') // operation
				.mockReturnValueOnce(true) // returnAll
				.mockReturnValueOnce({ search: 'test', ordering: 'name' }); // filters

			const mockGroups = [{ id: '1' }];
			mockedGenericFunctions.nimbaSmsApiRequestAllItems.mockResolvedValue(mockGroups);

			await nimbaSmsNode.execute.call(mockExecuteFunctions);

			expect(mockedGenericFunctions.nimbaSmsApiRequestAllItems).toHaveBeenCalledWith(
				'results',
				'GET',
				'groups',
				{},
				{ search: 'test', ordering: 'name' },
			);
		});

		it('devrait récupérer un nombre limité de groupes', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('group') // resource
				.mockReturnValueOnce('getAll') // operation
				.mockReturnValueOnce(false) // returnAll
				.mockReturnValueOnce({ offset: 5 }) // filters
				.mockReturnValueOnce(10); // limit

			const mockResponse = { results: [{ id: '1' }] };
			mockedGenericFunctions.nimbaSmsApiRequest.mockResolvedValue(mockResponse);

			await nimbaSmsNode.execute.call(mockExecuteFunctions);

			expect(mockedGenericFunctions.nimbaSmsApiRequest).toHaveBeenCalledWith(
				'GET',
				'groups',
				{},
				{ limit: 10, offset: 5 },
			);
		});
	});

	describe('Account Operations', () => {
		it('devrait récupérer le solde du compte', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('account') // resource
				.mockReturnValueOnce('getBalance'); // operation

			const mockBalance = { balance: 1000 };
			mockedGenericFunctions.nimbaSmsApiRequest.mockResolvedValue(mockBalance);

			await nimbaSmsNode.execute.call(mockExecuteFunctions);

			expect(mockedGenericFunctions.nimbaSmsApiRequest).toHaveBeenCalledWith('GET', 'accounts');
		});
	});

	describe('Purchase Operations', () => {
		describe('getAll operation', () => {
			it('devrait récupérer tous les achats', async () => {
				mockExecuteFunctions.getNodeParameter
					.mockReturnValueOnce('purchase') // resource
					.mockReturnValueOnce('getAll') // operation
					.mockReturnValueOnce(true) // returnAll
					.mockReturnValueOnce({ 
						payment_type: 'card', 
						start_date: '2023-01-01', 
						end_date: '2023-12-31' 
					}); // additionalFields

				const mockPurchases = [{ id: '1' }];
				mockedGenericFunctions.nimbaSmsApiRequestAllItems.mockResolvedValue(mockPurchases);

				await nimbaSmsNode.execute.call(mockExecuteFunctions);

				expect(mockedGenericFunctions.nimbaSmsApiRequestAllItems).toHaveBeenCalledWith(
					'results',
					'GET',
					'purchases',
					{},
					{ 
						payment_type: 'card', 
						start_date: '2023-01-01', 
						end_date: '2023-12-31' 
					},
				);
			});

			it('devrait récupérer un nombre limité d\'achats', async () => {
				mockExecuteFunctions.getNodeParameter
					.mockReturnValueOnce('purchase') // resource
					.mockReturnValueOnce('getAll') // operation
					.mockReturnValueOnce(false) // returnAll
					.mockReturnValueOnce({}) // additionalFields vide
					.mockReturnValueOnce(20); // limit

				const mockResponse = { results: [{ id: '1' }] };
				mockedGenericFunctions.nimbaSmsApiRequest.mockResolvedValue(mockResponse);

				await nimbaSmsNode.execute.call(mockExecuteFunctions);

				expect(mockedGenericFunctions.nimbaSmsApiRequest).toHaveBeenCalledWith(
					'GET',
					'purchases',
					{},
					{ limit: 20 },
				);
			});
		});


	});

	describe('SenderName Operations', () => {
		describe('getAll operation', () => {
			it('devrait récupérer tous les noms d\'expéditeur', async () => {
				mockExecuteFunctions.getNodeParameter
					.mockReturnValueOnce('senderName') // resource
					.mockReturnValueOnce('getAll') // operation
					.mockReturnValueOnce(true) // returnAll
					.mockReturnValueOnce({}); // additionalFields

				const mockSenderNames = [{ name: 'Sender1' }];
				mockedGenericFunctions.nimbaSmsApiRequestAllItems.mockResolvedValue(mockSenderNames);

				await nimbaSmsNode.execute.call(mockExecuteFunctions);

				expect(mockedGenericFunctions.nimbaSmsApiRequestAllItems).toHaveBeenCalledWith(
					'results',
					'GET',
					'sendernames',
					{},
					{},
				);
			});

			it('devrait récupérer un nombre limité de noms d\'expéditeur', async () => {
				mockExecuteFunctions.getNodeParameter
					.mockReturnValueOnce('senderName') // resource
					.mockReturnValueOnce('getAll') // operation
					.mockReturnValueOnce(false) // returnAll
					.mockReturnValueOnce({}) // additionalFields vide
					.mockReturnValueOnce(5); // limit

				const mockResponse = { results: [{ name: 'Sender1' }] };
				mockedGenericFunctions.nimbaSmsApiRequest.mockResolvedValue(mockResponse);

				await nimbaSmsNode.execute.call(mockExecuteFunctions);

				expect(mockedGenericFunctions.nimbaSmsApiRequest).toHaveBeenCalledWith(
					'GET',
					'sendernames',
					{},
					{ limit: 5 },
				);
			});
		});
	});

	describe('Gestion d\'erreurs', () => {
		it('devrait continuer en cas d\'erreur si continueOnFail est true', async () => {
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('account') // resource
				.mockReturnValueOnce('getBalance'); // operation

			mockedGenericFunctions.nimbaSmsApiRequest.mockRejectedValue(new Error('API Error'));

			const result = await nimbaSmsNode.execute.call(mockExecuteFunctions);

			expect(result).toEqual([[{ error: 'API Error' }]]);
		});

		it('devrait lancer l\'erreur si continueOnFail est false', async () => {
			mockExecuteFunctions.continueOnFail.mockReturnValue(false);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('account') // resource
				.mockReturnValueOnce('getBalance'); // operation

			const apiError = new Error('API Error');
			mockedGenericFunctions.nimbaSmsApiRequest.mockRejectedValue(apiError);

			await expect(nimbaSmsNode.execute.call(mockExecuteFunctions)).rejects.toThrow(apiError);
		});
	});
}); 