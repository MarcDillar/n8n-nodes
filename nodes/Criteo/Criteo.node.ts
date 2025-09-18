import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';

export class Criteo implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Criteo',
		name: 'criteo',
		icon: 'file:criteo.png',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Get data from Criteo API',
		defaults: {
			name: 'Criteo',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'criteoApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Audience',
						value: 'audience',
					},
				],
				default: 'audience',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['audience'],
					},
				},
				options: [
					{
						name: 'Compute Size',
						value: 'computeSize',
						action: 'Compute audience sizes',
						description: 'Get the size of existing audiences',
					},
					{
						name: 'Create',
						value: 'create',
						action: 'Create audience',
						description: 'Create a new audience',
					},
					{
						name: 'Delete',
						value: 'delete',
						action: 'Delete audiences',
						description: 'Delete one or more audiences',
					},
					{
						name: 'Estimate Size',
						value: 'estimateSize',
						action: 'Estimate audience size',
						description: 'Estimate the size of a new audience',
					},
					{
						name: 'Search',
						value: 'search',
						action: 'Search audiences',
						description: 'Search for audiences',
					},
					{
						name: 'Update',
						value: 'update',
						action: 'Update audience',
						description: 'Update an existing audience',
					},
				],
				default: 'search',
			},
			// Search filter parameters
			{
				displayName: 'Audience IDs',
				name: 'audienceIds',
				type: 'string',
				default: '',
				placeholder: '1001,1002,1003',
				description: 'Comma-separated list of audience IDs to filter by',
				displayOptions: {
					show: {
						resource: ['audience'],
						operation: ['search'],
					},
				},
			},
			{
				displayName: 'Advertiser IDs',
				name: 'advertiserIds',
				type: 'string',
				default: '',
				placeholder: '4949,5050',
				description: 'Comma-separated list of advertiser IDs to filter by',
				displayOptions: {
					show: {
						resource: ['audience'],
						operation: ['search'],
					},
				},
			},
			{
				displayName: 'Audience Segment IDs',
				name: 'audienceSegmentIds',
				type: 'string',
				default: '',
				placeholder: '42914,19234',
				description: 'Comma-separated list of audience segment IDs to filter by',
				displayOptions: {
					show: {
						resource: ['audience'],
						operation: ['search'],
					},
				},
			},
			{
				displayName: 'Ad Set IDs',
				name: 'adSetIds',
				type: 'string',
				default: '',
				placeholder: '1001,1002',
				description: 'Comma-separated list of ad set IDs to filter by',
				displayOptions: {
					show: {
						resource: ['audience'],
						operation: ['search'],
					},
				},
			},
			// Additional parameters
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				default: {},
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['audience'],
						operation: ['search'],
					},
				},
				options: [
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						default: 50,
						description: 'Max number of results to return',
						typeOptions: {
							minValue: 1,
						},
					},
					{
						displayName: 'Offset',
						name: 'offset',
						type: 'number',
						default: 0,
						description: 'The (zero-based) offset into the collection. The default is 0.',
						typeOptions: {
							minValue: 0,
						},
					},
				],
			},
			// Parameters for create operation
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				required: true,
				description: 'Name of the audience',
				displayOptions: {
					show: {
						resource: ['audience'],
						operation: ['create'],
					},
				},
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the audience',
				displayOptions: {
					show: {
						resource: ['audience'],
						operation: ['create'],
					},
				},
			},
			{
				displayName: 'Advertiser ID',
				name: 'advertiserId',
				type: 'string',
				default: '',
				required: true,
				description: 'ID of the advertiser',
				displayOptions: {
					show: {
						resource: ['audience'],
						operation: ['create'],
					},
				},
			},
			{
				displayName: 'Algebra (JSON)',
				name: 'algebra',
				type: 'json',
				default: '{\n  "and": [\n    {\n      "or": [\n        { "audienceSegmentId": "42914" },\n        { "audienceSegmentId": "19234" }\n      ]\n    },\n    {\n      "not": { "audienceSegmentId": "3482" }\n    }\n  ]\n}',
				required: true,
				description: 'Audience algebra structure in JSON format',
				displayOptions: {
					show: {
						resource: ['audience'],
						operation: ['create'],
					},
				},
			},
			// Parameters for update operation
			{
				displayName: 'Audience ID',
				name: 'audienceId',
				type: 'string',
				default: '',
				required: true,
				description: 'ID of the audience to update',
				displayOptions: {
					show: {
						resource: ['audience'],
						operation: ['update'],
					},
				},
			},
			{
				displayName: 'Name',
				name: 'updateName',
				type: 'string',
				default: '',
				description: 'New name of the audience',
				displayOptions: {
					show: {
						resource: ['audience'],
						operation: ['update'],
					},
				},
			},
			{
				displayName: 'Description',
				name: 'updateDescription',
				type: 'string',
				default: '',
				description: 'New description of the audience',
				displayOptions: {
					show: {
						resource: ['audience'],
						operation: ['update'],
					},
				},
			},
			{
				displayName: 'Algebra (JSON)',
				name: 'updateAlgebra',
				type: 'json',
				default: '',
				description: 'New audience algebra structure in JSON format',
				displayOptions: {
					show: {
						resource: ['audience'],
						operation: ['update'],
					},
				},
			},
			// Parameters for delete operation
			{
				displayName: 'Audience IDs',
				name: 'deleteAudienceIds',
				type: 'string',
				default: '',
				required: true,
				placeholder: '1001,1002,1003',
				description: 'Comma-separated list of audience IDs to delete',
				displayOptions: {
					show: {
						resource: ['audience'],
						operation: ['delete'],
					},
				},
			},
			// Parameters for compute size operation
			{
				displayName: 'Audience IDs',
				name: 'computeAudienceIds',
				type: 'string',
				default: '',
				required: true,
				placeholder: '1001,1002,1003',
				description: 'Comma-separated list of audience IDs to get sizes for',
				displayOptions: {
					show: {
						resource: ['audience'],
						operation: ['computeSize'],
					},
				},
			},
			// Parameters for estimate size operation
			{
				displayName: 'Advertiser ID',
				name: 'estimateAdvertiserId',
				type: 'string',
				default: '',
				required: true,
				description: 'ID of the advertiser for size estimation',
				displayOptions: {
					show: {
						resource: ['audience'],
						operation: ['estimateSize'],
					},
				},
			},
			{
				displayName: 'Algebra (JSON)',
				name: 'estimateAlgebra',
				type: 'json',
				default: '{\n  "and": [\n    {\n      "or": [\n        { "audienceSegmentId": "42914" },\n        { "audienceSegmentId": "19234" }\n      ]\n    },\n    {\n      "not": { "audienceSegmentId": "3482" }\n    }\n  ]\n}',
				required: true,
				description: 'Audience algebra structure in JSON format for size estimation',
				displayOptions: {
					show: {
						resource: ['audience'],
						operation: ['estimateSize'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('criteoApi');
		
		// Helper function to get OAuth2 access token
		const getAccessToken = async (): Promise<string> => {
			const tokenResponse = await this.helpers.httpRequest({
				method: 'POST',
				url: 'https://api.criteo.com/oauth2/token',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: `grant_type=client_credentials&client_id=${encodeURIComponent(credentials.clientId as string)}&client_secret=${encodeURIComponent(credentials.clientSecret as string)}`,
			});
			
			return tokenResponse.access_token;
		};

		// Helper function to make authenticated API requests
		const makeAuthenticatedRequest = async (
			accessToken: string,
			method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
			endpoint: string,
			body?: any,
			queryParams?: Record<string, any>
		): Promise<any> => {
			let url = `https://api.criteo.com${endpoint}`;
			
			if (queryParams) {
				const queryString = Object.entries(queryParams)
					.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`)
					.join('&');
				url += `?${queryString}`;
			}

			return await this.helpers.httpRequest({
				method: method as any,
				url,
				headers: {
					'Authorization': `Bearer ${accessToken}`,
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: body ? body : undefined,
				json: true,
			});
		};
		
		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				if (resource === 'audience') {
					// Get access token once for all operations
					const accessToken = await getAccessToken();

					if (operation === 'search') {
						// Build search attributes
						const attributes: any = {};
						
						// Get filter parameters and convert comma-separated strings to arrays
						const audienceIds = this.getNodeParameter('audienceIds', i) as string;
						if (audienceIds) {
							attributes.audienceIds = audienceIds.split(',').map(id => id.trim()).filter(id => id);
						}
						
						const advertiserIds = this.getNodeParameter('advertiserIds', i) as string;
						if (advertiserIds) {
							attributes.advertiserIds = advertiserIds.split(',').map(id => id.trim()).filter(id => id);
						}
						
						const audienceSegmentIds = this.getNodeParameter('audienceSegmentIds', i) as string;
						if (audienceSegmentIds) {
							attributes.audienceSegmentIds = audienceSegmentIds.split(',').map(id => id.trim()).filter(id => id);
						}
						
						const adSetIds = this.getNodeParameter('adSetIds', i) as string;
						if (adSetIds) {
							attributes.adSetIds = adSetIds.split(',').map(id => id.trim()).filter(id => id);
						}

						// Get additional fields
						const additionalFields = this.getNodeParameter('additionalFields', i) as any;
						const limit = additionalFields.limit || 50;
						const offset = additionalFields.offset || 0;

						// Make the search request
						const searchResponse = await makeAuthenticatedRequest(
							accessToken,
							'POST',
							'/marketing-solutions/audiences/search',
							{
								data: {
									type: 'AudienceSearch',
									attributes: attributes,
								},
							},
							{ limit, offset }
						);

						returnData.push({
							json: searchResponse,
							pairedItem: {
								item: i,
							},
						});
					} else if (operation === 'create') {
						// Get create parameters
						const name = this.getNodeParameter('name', i) as string;
						const description = this.getNodeParameter('description', i) as string;
						const advertiserId = this.getNodeParameter('advertiserId', i) as string;
						const algebra = this.getNodeParameter('algebra', i);

						// Make the create request
						const createResponse = await makeAuthenticatedRequest(
							accessToken,
							'POST',
							'/marketing-solutions/audiences/create',
							{
								data: [
									{
										type: 'Audience',
										attributes: {
											name: name,
											description: description,
											advertiserId: advertiserId,
											algebra: algebra,
										},
									},
								],
							}
						);

						returnData.push({
							json: createResponse,
							pairedItem: {
								item: i,
							},
						});
					} else if (operation === 'update') {
						// Get update parameters
						const audienceId = this.getNodeParameter('audienceId', i) as string;
						const updateName = this.getNodeParameter('updateName', i) as string;
						const updateDescription = this.getNodeParameter('updateDescription', i) as string;
						const updateAlgebra = this.getNodeParameter('updateAlgebra', i);

						// Build attributes object with only provided fields
						const attributes: any = {};
						if (updateName) attributes.name = updateName;
						if (updateDescription) attributes.description = { value: updateDescription };
						if (updateAlgebra) attributes.algebra = updateAlgebra;

						// Make the update request
						const updateResponse = await makeAuthenticatedRequest(
							accessToken,
							'PATCH',
							'/marketing-solutions/audiences',
							{
								data: [
									{
										id: audienceId,
										type: 'Audience',
										attributes: attributes,
									},
								],
							}
						);

						returnData.push({
							json: updateResponse,
							pairedItem: {
								item: i,
							},
						});
					} else if (operation === 'delete') {
						// Get delete parameters
						const deleteIds = this.getNodeParameter('deleteAudienceIds', i) as string;
						const audienceIds = deleteIds.split(',').map(id => id.trim()).filter(id => id);

						// Build data array for deletion
						const deleteData = audienceIds.map(id => ({
							id: id,
							type: 'Audience',
						}));

						// Make the delete request
						const deleteResponse = await makeAuthenticatedRequest(
							accessToken,
							'POST',
							'/marketing-solutions/audiences/delete',
							{
								data: deleteData,
							}
						);

						returnData.push({
							json: deleteResponse,
							pairedItem: {
								item: i,
							},
						});
					} else if (operation === 'computeSize') {
						// Get compute size parameters
						const computeIds = this.getNodeParameter('computeAudienceIds', i) as string;
						const audienceIds = computeIds.split(',').map(id => id.trim()).filter(id => id);

						// Build data array for size computation
						const computeData = audienceIds.map(id => ({
							id: id,
							type: 'Audience',
						}));

						// Make the compute sizes request
						const computeResponse = await makeAuthenticatedRequest(
							accessToken,
							'POST',
							'/marketing-solutions/audiences/compute-sizes',
							{
								data: computeData,
							}
						);

						returnData.push({
							json: computeResponse,
							pairedItem: {
								item: i,
							},
						});
					} else if (operation === 'estimateSize') {
						// Get estimate size parameters
						const estimateAdvertiserId = this.getNodeParameter('estimateAdvertiserId', i) as string;
						const estimateAlgebra = this.getNodeParameter('estimateAlgebra', i);

						// Make the estimate size request
						const estimateResponse = await makeAuthenticatedRequest(
							accessToken,
							'POST',
							'/marketing-solutions/audiences/estimate-size',
							{
								data: {
									type: 'Audience',
									attributes: {
										advertiserId: estimateAdvertiserId,
										algebra: estimateAlgebra,
									},
								},
							}
						);

						returnData.push({
							json: estimateResponse,
							pairedItem: {
								item: i,
							},
						});
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: {
							item: i,
						},
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}