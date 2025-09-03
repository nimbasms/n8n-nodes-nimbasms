import {
	validateEmail,
	validatePhoneNumber,
	formatPhoneNumber,
	validateSenderName,
	validateMessage,
	preparePaginationQuery,
	nimbaSmsApiRequest,
	nimbaSmsApiRequestAllItems,
} from '../nodes/NimbaSMS/GenericFunctions';
import { IExecuteFunctions, NodeApiError } from 'n8n-workflow';

// Mocks
const mockExecuteFunctions = {
	getCredentials: jest.fn(),
	helpers: {
		request: jest.fn(),
	},
	getNode: jest.fn(),
} as unknown as IExecuteFunctions;

// mockLoadOptionsFunctions sera utilisé dans des tests futurs

describe('GenericFunctions', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('validateEmail', () => {
		it('devrait valider les emails corrects', () => {
			expect(validateEmail('test@example.com')).toBe(true);
			expect(validateEmail('user.name@domain.co.uk')).toBe(true);
			expect(validateEmail('user+tag@example.org')).toBe(true);
		});

		it('devrait rejeter les emails incorrects', () => {
			expect(validateEmail('invalid-email')).toBe(false);
			expect(validateEmail('test@')).toBe(false);
			expect(validateEmail('@example.com')).toBe(false);
			expect(validateEmail('test.example.com')).toBe(false);
			expect(validateEmail('')).toBe(false);
		});
	});

	describe('validatePhoneNumber', () => {
		it('devrait valider les numéros de téléphone corrects', () => {
			expect(validatePhoneNumber('62300000')).toBe(true); // 8 digits minimum
			expect(validatePhoneNumber('+224623000000')).toBe(true); // Format international
			expect(validatePhoneNumber('224623000000')).toBe(true); // Avec code pays
			expect(validatePhoneNumber('123456789012345678')).toBe(true); // 18 digits maximum
		});

		it('devrait rejeter les numéros de téléphone incorrects', () => {
			expect(validatePhoneNumber('1234567')).toBe(false); // Trop court
			expect(validatePhoneNumber('1234567890123456789')).toBe(false); // Trop long
			expect(validatePhoneNumber('')).toBe(false); // Vide
		});

		it('devrait ignorer les caractères non numériques pour la validation', () => {
			expect(validatePhoneNumber('+224 623 00 00 00')).toBe(true);
			expect(validatePhoneNumber('(224) 623-000-000')).toBe(true);
		});
	});

	describe('formatPhoneNumber', () => {
		it('devrait formater les numéros guinéens sans préfixe', () => {
			expect(formatPhoneNumber('623000000')).toBe('+224623000000');
			expect(formatPhoneNumber('62300000')).toBe('+22462300000');
		});

		it('devrait formater les numéros avec code pays sans +', () => {
			expect(formatPhoneNumber('224623000000')).toBe('+224623000000');
		});

		it('devrait garder les numéros déjà formatés', () => {
			expect(formatPhoneNumber('+224623000000')).toBe('+224623000000');
			expect(formatPhoneNumber('+33123456789')).toBe('+33123456789');
		});

		it('devrait nettoyer les caractères non numériques', () => {
			expect(formatPhoneNumber('+224 623 00 00 00')).toBe('+224623000000');
			expect(formatPhoneNumber('(224) 623-000-000')).toBe('+224623000000');
		});
	});

	describe('validateSenderName', () => {
		it('devrait valider les noms d\'expéditeur corrects', () => {
			expect(validateSenderName('NimbaSMS')).toBe(true);
			expect(validateSenderName('Test123')).toBe(true);
			expect(validateSenderName('ABC')).toBe(true);
			expect(validateSenderName('12345678901')).toBe(true); // 11 caractères max
		});

		it('devrait rejeter les noms d\'expéditeur incorrects', () => {
			expect(validateSenderName('TooLongSender')).toBe(false); // Plus de 11 caractères
			expect(validateSenderName('Test-Name')).toBe(false); // Caractères spéciaux
			expect(validateSenderName('Test Name')).toBe(false); // Espaces
			expect(validateSenderName('')).toBe(false); // Vide
		});
	});

	describe('validateMessage', () => {
		it('devrait valider les messages corrects', () => {
			expect(validateMessage('Message court')).toBe(true);
			expect(validateMessage('A'.repeat(665))).toBe(true); // Exactement 665 caractères
		});

		it('devrait rejeter les messages trop longs', () => {
			expect(validateMessage('A'.repeat(666))).toBe(false); // Plus de 665 caractères
		});

		it('devrait accepter les messages vides', () => {
			expect(validateMessage('')).toBe(true);
		});
	});

	describe('preparePaginationQuery', () => {
		it('devrait préparer une requête avec returnAll=true', () => {
			const result = preparePaginationQuery({ returnAll: true });
			expect(result).toEqual({
				limit: 100,
				offset: 0,
			});
		});

		it('devrait préparer une requête avec des valeurs spécifiques', () => {
			const result = preparePaginationQuery({
				returnAll: false,
				limit: 25,
				offset: 50,
			});
			expect(result).toEqual({
				limit: 25,
				offset: 50,
			});
		});

		it('devrait utiliser des valeurs par défaut', () => {
			const result = preparePaginationQuery({ returnAll: false });
			expect(result).toEqual({
				limit: 50,
				offset: 0,
			});
		});
	});

	describe('nimbaSmsApiRequest', () => {
		beforeEach(() => {
			(mockExecuteFunctions.getCredentials as jest.Mock).mockResolvedValue({
				serviceId: 'test-service-id',
				secretToken: 'test-secret-token',
			});
		});

		it('devrait effectuer une requête API réussie', async () => {
			const mockResponse = { success: true, data: 'test' };
			(mockExecuteFunctions.helpers.request as jest.Mock).mockResolvedValue(mockResponse);

			const result = await nimbaSmsApiRequest.call(
				mockExecuteFunctions,
				'GET',
				'messages',
				{},
				{},
			);

			expect(result).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.request).toHaveBeenCalledWith({
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'GET',
				qs: {},
				uri: 'https://api.nimbasms.com/v1/messages',
				json: true,
				auth: {
					user: 'test-service-id',
					password: 'test-secret-token',
				},
			});
		});

		it('devrait inclure le body quand fourni', async () => {
			const mockResponse = { success: true };
			(mockExecuteFunctions.helpers.request as jest.Mock).mockResolvedValue(mockResponse);

			const body = { message: 'test' };
			await nimbaSmsApiRequest.call(mockExecuteFunctions, 'POST', 'messages', body);

			expect(mockExecuteFunctions.helpers.request).toHaveBeenCalledWith(
				expect.objectContaining({
					body,
					method: 'POST',
				}),
			);
		});

		it('devrait utiliser une URI personnalisée si fournie', async () => {
			const mockResponse = { success: true };
			(mockExecuteFunctions.helpers.request as jest.Mock).mockResolvedValue(mockResponse);

			const customUri = 'https://custom.api.com/endpoint';
			await nimbaSmsApiRequest.call(
				mockExecuteFunctions,
				'GET',
				'messages',
				{},
				{},
				customUri,
			);

			expect(mockExecuteFunctions.helpers.request).toHaveBeenCalledWith(
				expect.objectContaining({
					uri: customUri,
				}),
			);
		});

		it('devrait lancer une NodeApiError en cas d\'erreur', async () => {
			const mockError = new Error('API Error');
			(mockExecuteFunctions.helpers.request as jest.Mock).mockRejectedValue(mockError);
			(mockExecuteFunctions.getNode as jest.Mock).mockReturnValue({ name: 'Test Node' });

			await expect(
				nimbaSmsApiRequest.call(mockExecuteFunctions, 'GET', 'messages'),
			).rejects.toThrow(NodeApiError);
		});
	});

	describe('nimbaSmsApiRequestAllItems', () => {
		beforeEach(() => {
			(mockExecuteFunctions.getCredentials as jest.Mock).mockResolvedValue({
				serviceId: 'test-service-id',
				secretToken: 'test-secret-token',
			});
		});

		it('devrait récupérer tous les éléments avec pagination', async () => {
			const mockResponses = [
				{
					results: [{ id: 1 }, { id: 2 }],
					next: 'https://api.nimbasms.com/v1/messages?offset=100',
				},
				{
					results: [{ id: 3 }, { id: 4 }],
					next: null,
				},
			];

			(mockExecuteFunctions.helpers.request as jest.Mock)
				.mockResolvedValueOnce(mockResponses[0])
				.mockResolvedValueOnce(mockResponses[1]);

			const result = await nimbaSmsApiRequestAllItems.call(
				mockExecuteFunctions,
				'results',
				'GET',
				'messages',
			);

			expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
			expect(mockExecuteFunctions.helpers.request).toHaveBeenCalledTimes(2);
		});

		it('devrait gérer les réponses sans propriété de résultats', async () => {
			const mockResponse = { next: null };
			(mockExecuteFunctions.helpers.request as jest.Mock).mockResolvedValue(mockResponse);

			const result = await nimbaSmsApiRequestAllItems.call(
				mockExecuteFunctions,
				'results',
				'GET',
				'messages',
			);

			expect(result).toEqual([]);
		});

		it('devrait arrêter quand next est null ou undefined', async () => {
			const mockResponse = {
				results: [{ id: 1 }],
				next: null,
			};
			(mockExecuteFunctions.helpers.request as jest.Mock).mockResolvedValue(mockResponse);

			const result = await nimbaSmsApiRequestAllItems.call(
				mockExecuteFunctions,
				'results',
				'GET',
				'messages',
			);

			expect(result).toEqual([{ id: 1 }]);
			expect(mockExecuteFunctions.helpers.request).toHaveBeenCalledTimes(1);
		});
	});
}); 