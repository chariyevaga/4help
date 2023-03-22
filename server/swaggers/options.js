const options = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'HR API',
            version: '1.0.0',
            description: 'HR management system API documentation.',
            contact: {
                name: 'Kyyas Ilmyradov',
                email: 'kyyas.ilmyradov@gmail.com',
            },
        },
    },
    servers: [
        {
            url: `http://localhost:${process.env.PORT}`,
            variables: {
                host: {
                    enum: ['localhost'],
                    default: 'localhost',
                },
                port: {
                    default: process.env.PORT,
                },
            },
        },
    ],
    components: {
        securitySchemes: {
            basicAuth: {
                type: 'http',
                scheme: 'basic',
            },
        },
    },
    security: [
        {
            basicAuth: [],
        },
    ],

    apis: [`${__dirname}/*.yaml`, `${__dirname}/*/*.yaml`],
};

const specs = require('swagger-jsdoc')(options);

for (path of Object.values(specs.paths)) {
    for (key of Object.keys(path)) {
        if (!path[key].responses) path[key].responses = {};

        if (
            path[key].statuses.includes(200) &&
            path[key].description.startsWith('Editing')
        )
            path[key].responses[200] = {
                description:
                    'An object which consists edited ' +
                    path[key].tags[0].slice(0, path[key].tags[0].length - 1) +
                    ' information',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/' + path[key].tags[0],
                        },
                    },
                },
            };

        if (
            path[key].statuses.includes(200) &&
            path[key].description.startsWith('Returns')
        )
            path[key].responses[200] = {
                description:
                    'An JSON array of ' +
                    path[key].tags[0].slice(0, path[key].tags[0].length),
                content: {
                    'application/json': {
                        schema: {
                            type: 'array',
                            items: {
                                $ref:
                                    '#/components/schemas/ReducedFieldsOf' +
                                    path[key].tags[0],
                            },
                        },
                    },
                },
            };

        if (path[key].statuses.includes(201))
            path[key].responses[201] = {
                description:
                    'An object which consists new created ' +
                    path[key].tags[0].slice(0, path[key].tags[0].length - 1) +
                    ' information',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/' + path[key].tags[0],
                        },
                    },
                },
            };

        if (path[key].statuses.includes(204))
            path[key].responses[204] = {
                description: 'Successfully Deleted',
            };

        if (path[key].statuses.includes(400))
            path[key].responses[400] = {
                $ref: '#/components/responses/PathIdRequiredError',
            };

        if (path[key].statuses.includes(401))
            path[key].responses[401] = {
                $ref: '#/components/responses/UnauthorizedError',
            };

        if (path[key].statuses.includes(403))
            path[key].responses[403] = {
                $ref: '#/components/responses/InvalidCredentialsError',
            };

        if (path[key].statuses.includes(404))
            path[key].responses[404] = {
                $ref: '#/components/responses/NotFoundError',
            };

        if (path[key].statuses.includes(409))
            path[key].responses[409] = {
                $ref: '#/components/responses/ConflictError',
            };

        if (path[key].statuses.includes(500))
            path[key].responses[500] = {
                description: 'Unexpected error in the server side',
            };

        if (path[key].statuses.includes(201)) {
            // let requestForm = ['Meetings', 'Posts', 'Vacancies', 'Rules'].includes(
            let requestForm = ['Posts', 'Vacancies', 'Rules'].includes(
                path.post.tags[0]
            )
                ? 'multipart/form-data'
                : 'application/json';

            path[key].requestBody = {
                content: {
                    [requestForm]: {
                        schema: {
                            $ref:
                                '#/components/schemas/FillableFieldsOf' +
                                path[key].tags[0],
                        },
                    },
                },
            };
        }
    }
}

module.exports = specs;
