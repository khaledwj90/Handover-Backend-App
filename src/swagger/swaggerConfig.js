export const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: `${process.env.DB_NAME}`,
            description: `${process.env.DB_NAME} API List`,
            contact: {
                name: 'Khaled Wail Jaabari',
                email: "khaledwj90@gmail.com"
            },
            version: 10,
        }
    },
    securityDefinitions: {
        JWT: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
        },
    },
    servers: ["http://localhost:4001"],
    apis: ["src/routes/*.js", "src/swagger/componentsSwagger.yaml"],
    basePath: '/'
};
