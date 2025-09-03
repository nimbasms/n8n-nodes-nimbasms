import { smsOperations, smsFields } from '../../nodes/NimbaSMS/descriptions/SmsDescription';

describe('SmsDescription', () => {
	describe('smsOperations', () => {
		it('devrait être défini et exporté', () => {
			expect(smsOperations).toBeDefined();
			expect(Array.isArray(smsOperations)).toBe(true);
		});

		it('devrait avoir au moins une opération', () => {
			expect(smsOperations.length).toBeGreaterThan(0);
		});
	});

	describe('smsFields', () => {
		it('devrait être défini et exporté', () => {
			expect(smsFields).toBeDefined();
			expect(Array.isArray(smsFields)).toBe(true);
		});

		it('devrait avoir des champs pour les différentes opérations SMS', () => {
			const fieldNames = smsFields.map(field => field.name);
			
			// Vérifier que les champs principaux sont présents
			expect(fieldNames).toContain('senderName');
			expect(fieldNames).toContain('contact');
			expect(fieldNames).toContain('message');
			expect(fieldNames).toContain('to');
			expect(fieldNames).toContain('returnAll');
			expect(fieldNames).toContain('limit');
			expect(fieldNames).toContain('smsId');
		});

		it('devrait avoir des champs avec les bonnes propriétés de base', () => {
			smsFields.forEach(field => {
				expect(field).toHaveProperty('name');
				expect(field).toHaveProperty('displayName');
				expect(field).toHaveProperty('type');
			});
		});
	});
}); 