import { contactOperations, contactFields } from '../../nodes/NimbaSMS/descriptions/ContactDescription';

describe('ContactDescription', () => {
	describe('contactOperations', () => {
		it('devrait avoir la bonne structure d\'opérations', () => {
			expect(contactOperations).toHaveLength(1);
			
			const operationProperty = contactOperations[0];
			expect(operationProperty.displayName).toBe('Operation');
			expect(operationProperty.name).toBe('operation');
			expect(operationProperty.type).toBe('options');
			expect(operationProperty.default).toBe('create');
		});

		it('devrait avoir toutes les opérations de contact', () => {
			const operationProperty = contactOperations[0];
			const operations = operationProperty.options?.map((op: any) => op.value);
			
			expect(operations).toContain('create');
			expect(operations).toContain('getAll');
		});

		it('devrait avoir les bonnes conditions d\'affichage', () => {
			const operationProperty = contactOperations[0];
			expect(operationProperty.displayOptions).toEqual({
				show: {
					resource: ['contact'],
				},
			});
		});
	});

	describe('contactFields', () => {
		it('devrait avoir les champs de base pour les contacts', () => {
			const fieldNames = contactFields.map(field => field.name);
			
			expect(fieldNames).toContain('numero');
			expect(fieldNames).toContain('additionalFields');
			expect(fieldNames).toContain('returnAll');
			expect(fieldNames).toContain('limit');
			expect(fieldNames).toContain('filters');
		});

		it('devrait avoir le bon champ numero pour create', () => {
			const numeroField = contactFields.find(field => field.name === 'numero');
			
			expect(numeroField).toBeDefined();
			expect(numeroField?.displayName).toBe('Phone Number');
			expect(numeroField?.type).toBe('string');
			expect(numeroField?.required).toBe(true);
			expect(numeroField?.placeholder).toBe('+224123456789');
			expect(numeroField?.displayOptions).toEqual({
				show: {
					resource: ['contact'],
					operation: ['create'],
				},
			});
		});

		it('devrait avoir des conditions d\'affichage correctes', () => {
			contactFields.forEach(field => {
				if (field.displayOptions?.show?.resource) {
					expect(field.displayOptions.show.resource).toContain('contact');
				}
			});
		});
	});
}); 