import {
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CriteoApi implements ICredentialType {
	name = 'criteoApi';
	displayName = 'Criteo API';
	documentationUrl = 'https://developers.criteo.com/marketing-solutions/docs/welcome-to-criteo';
	properties: INodeProperties[] = [
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			required: true,
			description: 'Your Criteo API Client ID obtained from the Developer Dashboard',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			default: '',
			required: true,
			typeOptions: {
				password: true,
			},
			description: 'Your Criteo API Client Secret obtained from the Developer Dashboard',
		},
	];

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.criteo.com',
			url: '/oauth2/token',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: 'grant_type=client_credentials&client_id={{$credentials.clientId}}&client_secret={{$credentials.clientSecret}}',
		},
	};
}