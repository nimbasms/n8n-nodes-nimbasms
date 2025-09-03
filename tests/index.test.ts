import { nodes, credentials } from '../index';

describe('Index exports', () => {
	describe('nodes export', () => {
		it('devrait exporter un tableau de nœuds', () => {
			expect(Array.isArray(nodes)).toBe(true);
			expect(nodes).toHaveLength(1);
		});

		it('devrait exporter le nœud NimbaSMS', () => {
			const nimbaSmsNode = nodes[0];
			expect(nimbaSmsNode).toBeDefined();
			expect(nimbaSmsNode.description.name).toBe('nimbaSMS');
			expect(nimbaSmsNode.description.displayName).toBe('Nimba SMS');
		});

		it('devrait avoir les propriétés INodeType requises', () => {
			const nimbaSmsNode = nodes[0];
			expect(nimbaSmsNode).toHaveProperty('description');
			expect(nimbaSmsNode).toHaveProperty('execute');
			expect(nimbaSmsNode).toHaveProperty('methods');
		});
	});

	describe('credentials export', () => {
		it('devrait exporter un tableau de credentials', () => {
			expect(Array.isArray(credentials)).toBe(true);
			expect(credentials).toHaveLength(1);
		});

		it('devrait exporter les credentials NimbaSmsApi', () => {
			const nimbaSmsCredentials = credentials[0];
			expect(nimbaSmsCredentials).toBeDefined();
			expect(nimbaSmsCredentials.name).toBe('nimbaSmsApi');
			expect(nimbaSmsCredentials.displayName).toBe('Nimba SMS API');
		});

		it('devrait avoir les propriétés ICredentialType requises', () => {
			const nimbaSmsCredentials = credentials[0];
			expect(nimbaSmsCredentials).toHaveProperty('name');
			expect(nimbaSmsCredentials).toHaveProperty('displayName');
			expect(nimbaSmsCredentials).toHaveProperty('properties');
			expect(nimbaSmsCredentials).toHaveProperty('authenticate');
			expect(nimbaSmsCredentials).toHaveProperty('test');
		});
	});

	describe('Types de données', () => {
		it('devrait avoir des types cohérents', () => {
			// Vérifier que les exports correspondent aux types attendus
			nodes.forEach(node => {
				expect(typeof node.description).toBe('object');
				expect(typeof node.execute).toBe('function');
			});

			credentials.forEach(credential => {
				expect(typeof credential.name).toBe('string');
				expect(typeof credential.displayName).toBe('string');
				expect(Array.isArray(credential.properties)).toBe(true);
			});
		});
	});
}); 