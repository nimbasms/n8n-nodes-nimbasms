import { NimbaSMS } from '../nodes/NimbaSMS/NimbaSMS.node';
import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
} from 'n8n-workflow';
import * as GenericFunctions from '../nodes/NimbaSMS/GenericFunctions';

// Mock des fonctions génériques
jest.mock('../nodes/NimbaSMS/GenericFunctions');

const mockedGenericFunctions = GenericFunctions as jest.Mocked<typeof GenericFunctions>;

describe('NimbaSMS Node - Tests Simplifiés', () => {
	let nimbaSmsNode: NimbaSMS;
	let mockExecuteFunctions: jest.Mocked<IExecuteFunctions>;
	let mockLoadOptionsFunctions: jest.Mocked<ILoadOptionsFunctions>;

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

		// Mock ILoadOptionsFunctions
		mockLoadOptionsFunctions = {
			getCredentials: jest.fn(),
			helpers: {
				request: jest.fn(),
			},
			getNode: jest.fn(),
		} as unknown as jest.Mocked<ILoadOptionsFunctions>;

		// Configuration par défaut des mocks
		mockExecuteFunctions.getInputData.mockReturnValue([{}] as INodeExecutionData[]);
		mockExecuteFunctions.continueOnFail.mockReturnValue(false);
		(mockExecuteFunctions.helpers.returnJsonArray as jest.Mock).mockImplementation((data: any) => data);
		mockExecuteFunctions.getNode.mockReturnValue({ name: 'Nimba SMS Test' } as any);
	});

	describe('Description du nœud', () => {
		it('devrait avoir les bonnes propriétés de base', () => {
			expect(nimbaSmsNode.description.displayName).toBe('Nimba SMS');
			expect(nimbaSmsNode.description.name).toBe('nimbaSMS');
			expect(nimbaSmsNode.description.version).toBe(1);
			expect(nimbaSmsNode.description.group).toEqual(['communication']);
		});

		it('devrait avoir les credentials requises', () => {
			expect(nimbaSmsNode.description.credentials).toEqual([
				{
					name: 'nimbaSmsApi',
					required: true,
				},
			]);
		});

		it('devrait avoir des propriétés définies', () => {
			expect(Array.isArray(nimbaSmsNode.description.properties)).toBe(true);
			expect(nimbaSmsNode.description.properties.length).toBeGreaterThan(0);
		});
	});

	describe('loadOptions - getSenderNames', () => {
		it('devrait charger les noms d\'expéditeur acceptés', async () => {
			const mockResponse = {
				results: [
					{ name: 'Sender1', status: 'accepted' },
					{ name: 'Sender2', status: 'pending' },
					{ name: 'Sender3', status: 'accepted' },
				],
			};

			mockedGenericFunctions.nimbaSmsApiRequest.mockResolvedValue(mockResponse);

			const result = await nimbaSmsNode.methods!.loadOptions!.getSenderNames.call(
				mockLoadOptionsFunctions,
			);

			expect(result).toEqual([
				{ name: 'Sender1', value: 'Sender1' },
				{ name: 'Sender3', value: 'Sender3' },
			]);
		});

		it('devrait retourner un tableau vide en cas d\'erreur', async () => {
			mockedGenericFunctions.nimbaSmsApiRequest.mockRejectedValue(new Error('API Error'));

			const result = await nimbaSmsNode.methods!.loadOptions!.getSenderNames.call(
				mockLoadOptionsFunctions,
			);

			expect(result).toEqual([]);
		});
	});

	describe('Exécution du nœud', () => {
		it('devrait avoir une méthode execute', () => {
			expect(typeof nimbaSmsNode.execute).toBe('function');
		});

		it('devrait retourner un tableau de INodeExecutionData', async () => {
			// Mock simple pour account balance
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('account') // resource
				.mockReturnValueOnce('getBalance'); // operation

			const mockBalance = { balance: 1000, currency: 'USD' };
			mockedGenericFunctions.nimbaSmsApiRequest.mockResolvedValue(mockBalance);

			const result = await nimbaSmsNode.execute.call(mockExecuteFunctions);

			expect(Array.isArray(result)).toBe(true);
			expect(result).toHaveLength(1);
			expect(Array.isArray(result[0])).toBe(true);
		});

		it('devrait gérer les erreurs avec continueOnFail', async () => {
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('account') // resource
				.mockReturnValueOnce('getBalance'); // operation

			mockedGenericFunctions.nimbaSmsApiRequest.mockRejectedValue(new Error('API Error'));

			const result = await nimbaSmsNode.execute.call(mockExecuteFunctions);

			expect(result).toEqual([[{ error: 'API Error' }]]);
		});
	});

	describe('Structure des méthodes', () => {
		it('devrait avoir la structure methods définie', () => {
			expect(nimbaSmsNode.methods).toBeDefined();
			expect(nimbaSmsNode.methods?.loadOptions).toBeDefined();
			expect(nimbaSmsNode.methods?.loadOptions?.getSenderNames).toBeDefined();
		});
	});

	describe('Types et interfaces', () => {
		it('devrait implémenter INodeType', () => {
			expect(nimbaSmsNode).toHaveProperty('description');
			expect(nimbaSmsNode).toHaveProperty('execute');
			expect(nimbaSmsNode).toHaveProperty('methods');
		});

		it('devrait avoir une description conforme à INodeTypeDescription', () => {
			const desc = nimbaSmsNode.description;
			expect(desc).toHaveProperty('displayName');
			expect(desc).toHaveProperty('name');
			expect(desc).toHaveProperty('group');
			expect(desc).toHaveProperty('version');
			expect(desc).toHaveProperty('properties');
			expect(desc).toHaveProperty('credentials');
		});
	});
}); 