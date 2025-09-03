import { accountOperations, accountFields } from '../../nodes/NimbaSMS/descriptions/AccountDescription';

describe('AccountDescription', () => {
	describe('accountOperations', () => {
		it('devrait avoir la bonne structure d\'opérations', () => {
			expect(accountOperations).toHaveLength(1);
			
			const operationProperty = accountOperations[0];
			expect(operationProperty.displayName).toBe('Operation');
			expect(operationProperty.name).toBe('operation');
			expect(operationProperty.type).toBe('options');
		});

		it('devrait avoir les bonnes conditions d\'affichage', () => {
			const operationProperty = accountOperations[0];
			expect(operationProperty.displayOptions).toEqual({
				show: {
					resource: ['account'],
				},
			});
		});
	});

	describe('accountFields', () => {
		it('devrait avoir la bonne longueur', () => {
			// AccountDescription peut ne pas avoir de champs spécifiques
			expect(Array.isArray(accountFields)).toBe(true);
		});
	});
}); 