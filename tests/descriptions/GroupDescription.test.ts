import { groupOperations, groupFields } from '../../nodes/NimbaSMS/descriptions/GroupDescription';

describe('GroupDescription', () => {
	describe('groupOperations', () => {
		it('devrait avoir la bonne structure d\'opérations', () => {
			expect(groupOperations).toHaveLength(1);
			
			const operationProperty = groupOperations[0];
			expect(operationProperty.displayName).toBe('Operation');
			expect(operationProperty.name).toBe('operation');
			expect(operationProperty.type).toBe('options');
		});

		it('devrait avoir les bonnes conditions d\'affichage', () => {
			const operationProperty = groupOperations[0];
			expect(operationProperty.displayOptions).toEqual({
				show: {
					resource: ['group'],
				},
			});
		});
	});

	describe('groupFields', () => {
		it('devrait avoir les champs de base pour les groupes', () => {
			const fieldNames = groupFields.map(field => field.name);
			
			expect(fieldNames).toContain('returnAll');
			expect(fieldNames).toContain('limit');
			expect(fieldNames).toContain('filters');
		});

		it('devrait avoir des conditions d\'affichage correctes', () => {
			groupFields.forEach(field => {
				if (field.displayOptions?.show?.resource) {
					expect(field.displayOptions.show.resource).toContain('group');
				}
			});
		});
	});
}); 