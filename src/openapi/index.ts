/**
 * OpenAPI specification - Main entry point
 * Combines all sections of the API specification
 */
import { info } from './info';
import { servers } from './servers';
import { tags } from './tags';
import { schemas } from './components/schemas';
import { productPaths } from './paths/product.paths';
import { searchPaths } from './paths/search.paths';
import { brandPaths } from './paths/brand.paths';
import { creditsPaths } from './paths/credits.paths';
import { webhookPaths } from './paths/webhooks.paths';

// Security schemes
const securitySchemes = {
    ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "X-API-Key"
    }
};

// Combine paths
const paths = {
    ...productPaths,
    ...searchPaths,
    ...brandPaths,
    ...creditsPaths,
    ...webhookPaths
};

// Complete OpenAPI document
export const openAPIDoc = {
    ...info,
    servers,
    tags,
    paths,
    components: {
        schemas,
        securitySchemes
    }
};
