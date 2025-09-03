import { NimbaSmsApi } from '../credentials/NimbaSmsApi.credentials';

describe('NimbaSmsApi Credentials', () => {
	let credentials: NimbaSmsApi;

	beforeEach(() => {
		credentials = new NimbaSmsApi();
	});

	describe('Propriétés de base', () => {
		it('devrait avoir le bon nom', () => {
			expect(credentials.name).toBe('nimbaSmsApi');
		});

		it('devrait avoir le bon nom d\'affichage', () => {
			expect(credentials.displayName).toBe('Nimba SMS API');
		});

		it('devrait avoir l\'URL de documentation correcte', () => {
			expect(credentials.documentationUrl).toBe('https://developers.nimbasms.com');
		});
	});

	describe('Propriétés de configuration', () => {
		it('devrait avoir les bonnes propriétés de configuration', () => {
			expect(credentials.properties).toHaveLength(2);

			// Vérifier la propriété Service ID
			const serviceIdProperty = credentials.properties[0];
			expect(serviceIdProperty.displayName).toBe('Service ID');
			expect(serviceIdProperty.name).toBe('serviceId');
			expect(serviceIdProperty.type).toBe('string');
			expect(serviceIdProperty.required).toBe(true);
			expect(serviceIdProperty.default).toBe('');
			expect(serviceIdProperty.description).toBe('Your Nimba SMS Service ID (SID)');

			// Vérifier la propriété Secret Token
			const secretTokenProperty = credentials.properties[1];
			expect(secretTokenProperty.displayName).toBe('Secret Token');
			expect(secretTokenProperty.name).toBe('secretToken');
			expect(secretTokenProperty.type).toBe('string');
			expect(secretTokenProperty.required).toBe(true);
			expect(secretTokenProperty.default).toBe('');
			expect(secretTokenProperty.description).toBe('Your Nimba SMS Secret Token');
			expect(secretTokenProperty.typeOptions).toEqual({ password: true });
		});
	});

	describe('Configuration d\'authentification', () => {
		it('devrait avoir la bonne configuration d\'authentification', () => {
			expect(credentials.authenticate.type).toBe('generic');
			expect(credentials.authenticate.properties.auth).toEqual({
				username: '={{$credentials.serviceId}}',
				password: '={{$credentials.secretToken}}',
			});
		});
	});

	describe('Test de credentials', () => {
		it('devrait avoir la bonne configuration de test', () => {
			expect(credentials.test.request.baseURL).toBe('https://api.nimbasms.com');
			expect(credentials.test.request.url).toBe('/v1/accounts');
			expect(credentials.test.request.method).toBe('GET');
		});
	});

	describe('Validation du type', () => {
		it('devrait implémenter ICredentialType', () => {
			expect(credentials).toHaveProperty('name');
			expect(credentials).toHaveProperty('displayName');
			expect(credentials).toHaveProperty('properties');
			expect(credentials).toHaveProperty('authenticate');
			expect(credentials).toHaveProperty('test');
		});
	});
}); 