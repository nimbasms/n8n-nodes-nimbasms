import { purchaseOperations, purchaseFields } from '../../nodes/NimbaSMS/descriptions/PurchaseDescription';

describe('PurchaseDescription', () => {
	describe('purchaseOperations', () => {
		it('devrait avoir la bonne structure d\'opérations', () => {
			expect(purchaseOperations).toHaveLength(1);
			
			const operationProperty = purchaseOperations[0];
			expect(operationProperty.displayName).toBe('Operation');
			expect(operationProperty.name).toBe('operation');
			expect(operationProperty.type).toBe('options');
		});

		it('devrait avoir les bonnes conditions d\'affichage', () => {
			const operationProperty = purchaseOperations[0];
			expect(operationProperty.displayOptions).toEqual({
				show: {
					resource: ['purchase'],
				},
			});
		});
	});

	describe('purchaseFields', () => {
		it('devrait avoir les champs de base pour les achats', () => {
			const fieldNames = purchaseFields.map(field => field.name);
			
			expect(fieldNames).toContain('returnAll');
			expect(fieldNames).toContain('limit');
		});

		it('devrait avoir des conditions d\'affichage correctes', () => {
			purchaseFields.forEach(field => {
				if (field.displayOptions?.show?.resource) {
					expect(field.displayOptions.show.resource).toContain('purchase');
				}
			});
		});
	});
}); 