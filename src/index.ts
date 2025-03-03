import { Hono } from "hono";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { serveStatic } from "hono/serve-static";
import * as fs from "fs";
import * as path from "path";
import { timing, setMetric, startTime, endTime } from "hono/timing";
import type { TimingVariables } from "hono/timing";
import { prettyJSON } from "hono/pretty-json";
import { languageDetector } from "hono/language";
import { cache } from "hono/cache";
import type { MiddlewareHandler } from "hono";
import { cors } from "hono/cors";
import {
  getSurrealDB,
  closeSurrealDB,
  getProducts,
  getProductById,
} from "./database";
import { handle } from "hono/vercel";
import {
  ProductSchema,
  ProductListResponseSchema,
  ProductResponseSchema,
  ErrorResponseSchema,
  ProductListQuerySchema,
  ProductPathParamsSchema,
} from "./schemas";

export const runtime = "edge";

// Type definitions for our app variables
type Variables = TimingVariables;

// Create the main Hono app
const app = new Hono<{ Variables: Variables }>();

// Provide the Swagger template directly in the code to avoid file loading issues
const getSwaggerTemplate = (): string => {
  console.log("Using embedded Swagger template with inline styles");

  // This is a direct copy of the src/swagger-template.html content
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>API Documentation</title>
    <link
      rel="stylesheet"
      type="text/css"
      href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css"
    />
    <style>
      /* Ultra-minimal styling inspired by shadcn UI */
      :root {
        --background: #ffffff;
        --foreground: #000000;
        --muted: #f8f8f8;
        --muted-foreground: #71717a;
        --border: #e5e5e5;
        --border-strong: #d4d4d4;
        --radius: 0.375rem;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Helvetica, Arial, sans-serif;
        background-color: var(--background);
        color: var(--foreground);
        margin: 0;
        padding: 0;
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
      }

      /* Hide the default Swagger UI header */
      .swagger-ui .topbar {
        display: none !important;
      }

      /* Clean, minimal header */
      .api-header {
        background-color: #000000;
        color: #ffffff;
        padding: 0.6rem 1.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .api-header h1 {
        margin: 0;
        font-size: 0.9rem;
        font-weight: 500;
        letter-spacing: -0.01em;
      }

      .api-header .links {
        display: flex;
        gap: 1.5rem;
      }

      .api-header .links a {
        color: #ffffff;
        text-decoration: none;
        font-size: 0.8rem;
        opacity: 0.85;
        transition: opacity 0.2s;
      }

      .api-header .links a:hover {
        opacity: 1;
      }

      /* Content container */
      .content-wrapper {
        max-width: 1100px;
        margin: 0 auto;
        padding: 1.5rem;
      }

      /* API info section */
      .swagger-ui .info {
        margin: 0;
      }

      .swagger-ui .info .title {
        font-weight: 500;
        font-size: 1.3rem;
        color: var(--foreground);
        margin-top: 0;
      }

      .swagger-ui .information-container {
        background: none;
        padding: 0;
        margin-bottom: 2rem;
        border-bottom: 1px solid var(--border);
        padding-bottom: 1.5rem;
      }

      /* Clean version badges styling */
      .swagger-ui .info .title span,
      .swagger-ui .info .title small,
      .swagger-ui .version-pragma {
        background-color: #ffffff !important;
        color: var(--foreground) !important;
        border: 1px solid var(--border);
        font-size: 0.7rem;
        font-weight: 400;
        margin-left: 0.5rem;
        border-radius: 0.25rem;
        padding: 0.25rem 0.5rem;
        position: relative;
        top: -0.15rem;
      }

      /* Operations */
      .swagger-ui .opblock {
        margin: 0 0 1rem;
        border-radius: var(--radius);
        box-shadow: none;
        border: 1px solid var(--border);
        background-color: var(--background);
        overflow: hidden;
      }

      /* Remove excess borders */
      .swagger-ui .opblock-description-wrapper,
      .swagger-ui .opblock-external-docs-wrapper,
      .swagger-ui .opblock-title_normal {
        border: none !important;
        background: none !important;
      }

      .swagger-ui .opblock .opblock-summary {
        padding: 0.75rem 1rem;
        border-bottom: 1px solid var(--border);
      }

      /* Monochromatic method badges */
      .swagger-ui .opblock .opblock-summary-method {
        border-radius: 0.25rem;
        font-weight: 500;
        font-size: 0.7rem;
        padding: 0.2rem 0.5rem;
        background-color: #000000 !important;
        color: #ffffff !important;
      }

      /* Remove all color varieties from methods */
      .swagger-ui .opblock.opblock-get .opblock-summary-method,
      .swagger-ui .opblock.opblock-post .opblock-summary-method,
      .swagger-ui .opblock.opblock-delete .opblock-summary-method,
      .swagger-ui .opblock.opblock-put .opblock-summary-method,
      .swagger-ui .opblock.opblock-patch .opblock-summary-method {
        background-color: #000000 !important;
      }

      /* Make all opblocks monochrome */
      .swagger-ui .opblock.opblock-get,
      .swagger-ui .opblock.opblock-post,
      .swagger-ui .opblock.opblock-delete,
      .swagger-ui .opblock.opblock-put,
      .swagger-ui .opblock.opblock-patch {
        background-color: var(--background) !important;
        border-color: var(--border) !important;
      }

      /* Make borders lighter and backgrounds consistent */
      .swagger-ui * {
        border-color: var(--border) !important;
      }

      /* Simplify all UI containers by removing background colors */
      .swagger-ui .parameters-container,
      .swagger-ui .opblock-section-header,
      .swagger-ui .tab-container,
      .swagger-ui .response-container,
      .swagger-ui .model-container,
      .swagger-ui .model-box,
      .swagger-ui .servers-container {
        background: var(--background) !important;
      }

      /* Super aggressive tab styling - remove all colors */
      .swagger-ui .tab,
      .swagger-ui .tab ul,
      .swagger-ui .tab li, 
      .swagger-ui .tab li:after,
      .swagger-ui .tab li.active,
      .swagger-ui .tab li.active:after,
      .swagger-ui .tabitem,
      .swagger-ui .tabitem.active,
      .swagger-ui .tab-header .tab-item,
      .swagger-ui .tab-header .tab-item.active,
      .swagger-ui .tab-header .tab-item::after,
      .swagger-ui .tab-header .tab-item.active::after,
      .swagger-ui .opblock-tag span:after,
      .swagger-ui .tab li:hover:after,
      .swagger-ui .tab-header:after,
      .swagger-ui .parameters-container .tabs-header .tab span:after,
      /* Target ALL active indicators */
      .swagger-ui .parameters-container .tab-header .tabs-menu li::after,
      .swagger-ui .parameters-container .tab-header .tabs-menu li.active::after,
      .swagger-ui .parameters-container .tab-header .tabs-menu.active::after,
      .swagger-ui .parameters-container .tab-header .tabs-menu li,
      .swagger-ui section.models .model-container .tabs .operation-tag-content-wrapper,
      .swagger-ui .parameters-tabs-headers .tab-header,
      .swagger-ui .parameters-tabs-headers .tab-header .tabs-menu.menu-item,
      .swagger-ui .parameters-tabs-headers .tab-header .tabs-menu.menu-item.active,
      .swagger-ui .parameters-tabs-headers .tab-header .tabs-menu.menu-item.active:after {
        background: var(--muted) !important;
        color: var(--foreground) !important;
        border-color: var(--border) !important;
      }

      /* Specifically target active tab styles - NO COLORS */
      .swagger-ui .tab li.active,
      .swagger-ui .tab-header .tab-item.active,
      .swagger-ui .parameters-container .tab-header .tabs-menu li.active,
      .swagger-ui
        .parameters-tabs-headers
        .tab-header
        .tabs-menu.menu-item.active {
        background: var(--background) !important;
        font-weight: 600;
        border-bottom: 1px solid var(--border) !important;
      }

      /* COMPLETELY REMOVE tab indicator animations and colors */
      .swagger-ui .tab li::after,
      .swagger-ui .tab li.active::after,
      .swagger-ui .tab-header .tab-item::after,
      .swagger-ui .tab-header .tab-item.active::after,
      .swagger-ui .parameters-container .tab-header .tabs-menu li::after,
      .swagger-ui .parameters-container .tab-header .tabs-menu li.active::after,
      .swagger-ui
        .parameters-tabs-headers
        .tab-header
        .tabs-menu.menu-item::after,
      .swagger-ui
        .parameters-tabs-headers
        .tab-header
        .tabs-menu.menu-item.active::after,
      .swagger-ui .opblock-tag span:after,
      .swagger-ui .parameters-tabs-headers .tabs-menu-item.active:after,
      .swagger-ui .parameters-tabs-headers .tabs-menu-item:after {
        display: none !important;
        height: 0 !important;
        width: 0 !important;
        background: transparent !important;
        border: none !important;
        opacity: 0 !important;
      }

      /* Simplify tab bar layout */
      .swagger-ui
        .parameters-container
        .parameters-col_description
        .parameter__inner,
      .swagger-ui
        .parameters-container
        .parameters-col_description
        .parameter__info,
      .swagger-ui .parameters-container .parameters {
        background: var(--background) !important;
        border: none !important;
      }

      /* Fix tabs and tab content */
      .swagger-ui .operation-tag-content > div {
        background: var(--background) !important;
      }

      /* Path typography */
      .swagger-ui .opblock .opblock-summary-path {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
          "Liberation Mono", "Courier New", monospace;
        font-size: 0.8rem;
        color: var(--foreground) !important;
      }

      /* Path links */
      .swagger-ui .opblock .opblock-summary-path a {
        color: var(--foreground) !important;
      }

      /* Models */
      .swagger-ui .model {
        font-size: 0.875rem;
        color: var(--foreground);
      }

      .swagger-ui .model-title {
        font-weight: 500;
        font-size: 0.9rem;
        color: var(--foreground);
      }

      /* Buttons */
      .swagger-ui .btn {
        border-radius: var(--radius);
        font-weight: 400;
        padding: 0.4rem 0.75rem;
        border: 1px solid var(--border);
        background-color: var(--background);
        color: var(--foreground);
        font-size: 0.8rem;
        line-height: 1.25rem;
        cursor: pointer;
        transition: 0.2s background;
      }

      .swagger-ui .btn:hover {
        background-color: var(--muted);
      }

      .swagger-ui .btn.execute {
        background-color: #000000 !important;
        color: #ffffff !important;
        border-color: #000000 !important;
      }

      .swagger-ui .btn.execute:hover {
        opacity: 0.9;
      }

      .swagger-ui .btn.cancel {
        background-color: var(--muted) !important;
        color: var(--foreground) !important;
        border-color: var(--border) !important;
      }

      /* Response status badges */
      .swagger-ui .responses-inner h4,
      .swagger-ui .responses-inner h5 {
        color: var(--foreground) !important;
        font-size: 0.9rem;
        font-weight: 500;
      }

      .swagger-ui .response-col_status {
        color: var(--foreground) !important;
        font-size: 0.8rem;
      }

      /* Override all response code colors */
      .swagger-ui .responses-table .response-col_status {
        color: var(--foreground) !important;
      }

      /* Form controls */
      .swagger-ui input[type="text"],
      .swagger-ui input[type="password"],
      .swagger-ui input[type="search"],
      .swagger-ui input[type="email"] {
        padding: 0.5rem;
        border-radius: var(--radius);
        border: 1px solid var(--border);
        background-color: var(--background);
        color: var(--foreground);
        font-size: 0.8rem;
        line-height: 1.25rem;
      }

      .swagger-ui select {
        padding: 0.4rem 0.5rem;
        border-radius: var(--radius);
        border: 1px solid var(--border);
        background-color: var(--background);
        color: var(--foreground);
        font-size: 0.8rem;
        line-height: 1.25rem;
      }

      /* Tables */
      .swagger-ui table {
        border-collapse: collapse;
        width: 100%;
      }

      .swagger-ui table thead tr {
        border-bottom: 1px solid var(--border);
        background-color: var(--muted);
      }

      .swagger-ui table tbody tr:not(:last-child) {
        border-bottom: 1px solid var(--border);
      }

      .swagger-ui table th,
      .swagger-ui table td {
        padding: 0.6rem 0.75rem;
        text-align: left;
        color: var(--foreground);
        font-size: 0.8rem;
      }

      /* Tags and sections */
      .swagger-ui .opblock-tag {
        border-bottom: none;
        margin-top: 1.5rem;
        color: var(--foreground);
        font-size: 1.1rem;
      }

      .swagger-ui .opblock-tag:first-of-type {
        margin-top: 0.5rem;
      }

      .swagger-ui .opblock-tag-section h3 {
        font-size: 1.1rem;
        font-weight: 500;
        color: var(--foreground);
      }

      /* Scheme selection */
      .swagger-ui .scheme-container {
        background: none;
        box-shadow: none;
        margin: 0 0 1.5rem;
        padding: 0 0 1.5rem;
        border-bottom: 1px solid var(--border);
      }

      .swagger-ui .auth-wrapper {
        display: flex;
        justify-content: flex-end;
      }

      .swagger-ui .auth-container {
        margin: 0;
      }

      /* Models section */
      .swagger-ui section.models {
        border: 1px solid var(--border);
        border-radius: var(--radius);
        margin: 2rem 0;
      }

      .swagger-ui section.models h4 {
        font-size: 0.9rem;
        font-weight: 500;
        margin: 0;
        padding: 0.8rem 1rem;
        color: var(--foreground);
      }

      .swagger-ui section.models .model-container {
        margin: 0;
        padding: 1rem;
        border-top: 1px solid var(--border);
        background-color: var(--background) !important;
      }

      /* Description text */
      .swagger-ui .markdown p {
        font-size: 0.8rem;
        line-height: 1.5;
        margin: 0.5rem 0;
        color: var(--foreground);
      }

      /* Code samples - ELEGANT LIGHT MODE */
      .swagger-ui .highlight-code,
      .swagger-ui pre {
        background-color: #fafafa !important;
        color: #333333 !important;
      }

      .swagger-ui .microlight {
        background-color: #fafafa !important;
        color: #333333 !important;
        font-size: 0.8rem;
        padding: 0.8rem 1rem;
        border-radius: var(--radius);
        border: 1px solid var(--border);
        font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo,
          monospace;
        line-height: 1.5;
      }

      /* Elegant syntax highlighting with readable grayscale */
      /* Basic tokens: punctuation, braces */
      .swagger-ui .microlight .token.punctuation {
        color: #555555 !important;
      }

      /* Properties, keys */
      .swagger-ui .microlight .token.property {
        color: #333333 !important;
        font-weight: 600 !important;
      }

      /* Strings */
      .swagger-ui .microlight .token.string {
        color: #444444 !important;
      }

      /* Numbers, booleans */
      .swagger-ui .microlight .token.number,
      .swagger-ui .microlight .token.boolean {
        color: #222222 !important;
        font-weight: 500 !important;
      }

      /* Functions, keywords */
      .swagger-ui .microlight .token.function,
      .swagger-ui .microlight .token.keyword {
        color: #333333 !important;
        font-weight: 600 !important;
      }

      /* Comments */
      .swagger-ui .microlight .token.comment,
      .swagger-ui .microlight .token.prolog,
      .swagger-ui .microlight .token.doctype,
      .swagger-ui .microlight .token.cdata {
        color: #777777 !important;
        font-style: italic !important;
      }

      /* Other tokens */
      .swagger-ui .microlight .token.operator,
      .swagger-ui .microlight .token.tag,
      .swagger-ui .microlight .token.attr-name,
      .swagger-ui .microlight .token.attr-value,
      .swagger-ui .microlight .token.namespace,
      .swagger-ui .microlight .token.constant,
      .swagger-ui .microlight .token.symbol,
      .swagger-ui .microlight .token.deleted,
      .swagger-ui .microlight .token.selector,
      .swagger-ui .microlight .token.important,
      .swagger-ui .microlight .token.atrule,
      .swagger-ui .microlight .token.builtin,
      .swagger-ui .microlight .token.entity,
      .swagger-ui .microlight .token.url {
        color: #333333 !important;
      }

      /* JSON specific styling - aggressively override any colors */
      .swagger-ui .curl-command,
      .swagger-ui .curl-command .microlight,
      .swagger-ui .response-col_description__inner .microlight,
      .swagger-ui .opblock-body pre,
      .swagger-ui .example pre,
      .swagger-ui .model-example pre {
        background-color: #fafafa !important;
        color: #333333 !important;
      }

      /* Force override ALL inline styles (important!) */
      .swagger-ui .microlight span,
      .swagger-ui .microlight span[style],
      .swagger-ui .curl-command span,
      .swagger-ui pre span,
      .swagger-ui .highlight-code span,
      .swagger-ui [class*="microlight"] span,
      /* Target all styled elements */
      .swagger-ui *[style*="color"],
      .swagger-ui *[style*="background"],
      /* Target specific blue elements */
      .swagger-ui .tabitem.active,
      .swagger-ui .tabitem,
      .swagger-ui select,
      .swagger-ui button,
      .swagger-ui .tab-header,
      .swagger-ui .tab-item,
      .swagger-ui .parameter__name,
      .swagger-ui table *,
      .swagger-ui a,
      .swagger-ui .servers,
      .swagger-ui .download-url-wrapper,
      .swagger-ui .opblock-control-arrow,
      .swagger-ui input {
        color: #333333 !important;
        background: transparent !important;
        border-color: var(--border) !important;
      }

      /* ALL links colorless */
      .swagger-ui a,
      .swagger-ui a:visited,
      .swagger-ui a:hover,
      .swagger-ui a:active {
        color: #333333 !important;
        text-decoration: underline !important;
      }

      /* Remove all borders except where structurally needed */
      .swagger-ui .wrapper,
      .swagger-ui .information-container,
      .swagger-ui .scheme-container,
      .swagger-ui .auth-wrapper,
      .swagger-ui .models,
      .swagger-ui .opblock-tag-section {
        box-shadow: none !important;
        background: transparent !important;
      }

      /* Simplify tables */
      .swagger-ui table thead tr {
        background: var(--muted) !important;
        color: var(--foreground) !important;
      }

      .swagger-ui table,
      .swagger-ui table tr,
      .swagger-ui table td {
        background: var(--background) !important;
        color: var(--foreground) !important;
      }

      /* Reduce spacing */
      .swagger-ui .wrapper {
        padding: 0 !important;
        margin: 0 !important;
      }

      /* Clean up parameter structure */
      .swagger-ui .parameters-col_description {
        border-top: none !important;
      }

      /* Override specific console colors */
      .swagger-ui [style*="color: rgb(77, 208, 225)"],
      .swagger-ui [style*="color: rgb(162, 252, 162)"],
      .swagger-ui [style*="color: rgb(195, 232, 141)"],
      .swagger-ui [style*="color: rgb(240, 113, 120)"],
      .swagger-ui [style*="color: rgb(166, 226, 46)"],
      .swagger-ui [style*="color: rgb(195, 232, 141)"],
      .swagger-ui [style*="color:#"],
      .swagger-ui [style*="color: #"] {
        color: #333333 !important;
      }

      /* Property keys - slightly bolder */
      .swagger-ui .microlight span[style*="rgb(195, 232, 141)"],
      .swagger-ui .microlight span[style*="color:#"],
      .swagger-ui .microlight span[style*="color: #"],
      .swagger-ui .microlight span[style*="green"] {
        color: #333333 !important;
        font-weight: 600;
      }

      /* String values - slightly different tone */
      .swagger-ui .microlight span[style*="rgb(162, 252, 162)"],
      .swagger-ui .microlight span[style*="color: green"],
      .swagger-ui .microlight span[style*="rgb(166, 226, 46)"] {
        color: #444444 !important;
      }

      /* Code blocks for markdown */
      .swagger-ui .markdown code,
      .swagger-ui .renderedMarkdown code {
        background-color: var(--muted);
        padding: 0.125rem 0.25rem;
        border-radius: 0.25rem;
        font-size: 0.75rem;
        color: var(--foreground);
      }

      /* Links */
      .swagger-ui .info a,
      .swagger-ui .markdown a,
      .swagger-ui .renderedMarkdown a {
        color: var(--foreground) !important;
        text-decoration: underline;
      }

      /* Hide extra UI elements */
      .swagger-ui .info hgroup.main {
        margin: 0;
      }

      /* All focused elements */
      .swagger-ui *:focus-visible {
        outline-color: var(--foreground) !important;
      }

      /* Parameter labels */
      .swagger-ui .parameters-col_name {
        color: var(--foreground);
        font-size: 0.8rem;
      }

      /* Parameter names and required asterisk */
      .swagger-ui .parameter__name,
      .swagger-ui .parameter__name span {
        color: var(--foreground) !important;
        font-size: 0.8rem;
      }

      /* Required field indicator */
      .swagger-ui .parameter__name.required:after {
        color: var(--foreground) !important;
      }

      /* Fix ALL SVG elements with monochrome */
      .swagger-ui svg,
      .swagger-ui svg path,
      .swagger-ui svg rect,
      .swagger-ui svg circle,
      .swagger-ui svg line,
      .swagger-ui svg polygon,
      .swagger-ui .arrow,
      .swagger-ui .model-toggle,
      .swagger-ui .expand-operation svg,
      .swagger-ui .opblock-control-arrow {
        fill: currentColor !important;
        stroke: currentColor !important;
        color: var(--foreground) !important;
      }

      /* All icons need to be monochrome */
      .swagger-ui *[class*="icon"],
      .swagger-ui .svg-assets,
      .swagger-ui .expand-methods svg,
      .swagger-ui .arrow,
      .swagger-ui button svg {
        fill: var(--foreground) !important;
        color: var(--foreground) !important;
        background: transparent !important;
      }

      /* Filter box */
      .swagger-ui .filter-container input {
        border: 1px solid var(--border);
        padding: 0.4rem 0.6rem;
        font-size: 0.8rem;
      }

      /* Make the OAS/version badges specifically monochrome */
      .swagger-ui .version-pragma {
        color: var(--foreground) !important;
        background-color: var(--muted) !important;
        border: 1px solid var(--border-strong);
      }

      /* Override all operation icons */
      .swagger-ui .opblock .opblock-summary-operation-id,
      .swagger-ui .opblock .opblock-summary-path,
      .swagger-ui .opblock .opblock-summary-path__deprecated,
      .swagger-ui .opblock .opblock-summary-description {
        color: var(--foreground) !important;
      }

      /* Remove any highlight colors */
      .swagger-ui .opblock .opblock-section-header {
        background-color: var(--muted) !important;
        border-color: var(--border) !important;
      }

      /* Clean up authorization button */
      .swagger-ui .btn.authorize {
        color: var(--foreground) !important;
        border-color: var(--border) !important;
      }

      /* Harmonize selection colors */
      ::selection {
        background-color: rgba(0, 0, 0, 0.1);
      }

      /* Response content */
      .swagger-ui .response-col_description__inner div,
      .swagger-ui .response-col_description__inner span {
        color: var(--foreground) !important;
        background-color: var(--muted) !important;
        border-color: var(--border) !important;
      }

      /* Simplify opblock description wrapper */
      .swagger-ui .opblock-description-wrapper {
        padding: 0.75rem 1rem !important;
        margin: 0 !important;
        background: var(--background) !important;
        border-bottom: 1px solid var(--border) !important;
      }

      /* Remove excessive backgrounds */
      .swagger-ui .opblock-description-wrapper div,
      .swagger-ui .opblock-description-wrapper p,
      .swagger-ui .opblock-external-docs-wrapper,
      .swagger-ui .renderedMarkdown {
        background: transparent !important;
        padding: 0 !important;
        margin-bottom: 0.5rem !important;
        border: none !important;
      }

      /* Blues in forms and UI */
      .swagger-ui input[type="text"],
      .swagger-ui input[type="password"],
      .swagger-ui input[type="search"],
      .swagger-ui input[type="email"],
      .swagger-ui textarea {
        border: 1px solid var(--border) !important;
        background: var(--background) !important;
        color: var(--foreground) !important;
        box-shadow: none !important;
      }

      /* Blue focus states */
      .swagger-ui *:focus,
      .swagger-ui *:focus-within,
      .swagger-ui *:active {
        outline-color: #000000 !important;
        border-color: #000000 !important;
        box-shadow: none !important;
      }

      /* Fix tabs and buttons with blue */
      .swagger-ui .tab {
        background: transparent !important;
      }

      /* Response section */
      .swagger-ui .responses-inner {
        padding: 0.5rem 0;
      }

      /* Parameters */
      .swagger-ui .parameters-container {
        margin: 0;
      }

      .swagger-ui .parameters-container .parameters {
        margin: 0.5rem 0;
      }

      /* Parameter description */
      .swagger-ui .parameter__in {
        color: var(--muted-foreground);
        font-size: 0.75rem;
      }

      /* Remove JSON editor coloring */
      .swagger-ui .json-schema-form-item {
        color: var(--foreground) !important;
      }

      /* JSON Property names */
      .swagger-ui .model .property {
        color: var(--foreground) !important;
        font-size: 0.8rem;
      }

      /* Section headers */
      .swagger-ui h4,
      .swagger-ui h5 {
        font-size: 0.9rem;
        font-weight: 500;
        margin: 0.5rem 0;
      }

      /* Response tables */
      .swagger-ui .response-col_status {
        width: auto;
        padding: 0.5rem;
      }

      /* Servers dropdown */
      .swagger-ui .servers-title {
        font-size: 0.8rem;
        margin: 0 0 0.5rem 0;
      }

      .swagger-ui .servers > label {
        font-size: 0.8rem;
      }

      /* Copy button */
      .swagger-ui .copy-to-clipboard {
        background: var(--background);
        border: 1px solid var(--border);
      }

      /* Remove gradient backgrounds */
      .swagger-ui .opblock .opblock-section-header h4 {
        color: var(--foreground);
        font-size: 0.9rem;
      }

      /* Operation summary */
      .swagger-ui .opblock-summary-description {
        font-size: 0.8rem;
        color: var(--muted-foreground) !important;
      }

      /* Make checkbox more modern */
      .swagger-ui input[type="checkbox"] {
        margin-right: 0.5rem;
      }

      /* All text in tables */
      .swagger-ui td {
        font-size: 0.8rem;
      }

      /* Response content code blocks */
      .swagger-ui pre {
        font-size: 0.8rem;
        background-color: var(--muted) !important;
        color: var(--foreground) !important;
        border: 1px solid var(--border);
      }
      
      /* Hide Filter by tag field */
      .swagger-ui .filter-container {
        display: none !important;
      }
    </style>
  </head>
  <body>
    <div class="api-header">
      <h1>API Documentation</h1>
      <div class="links">
        <a href="/api/products">API</a>
        <a href="https://github.com/frontnow/bun-hono-surrealdb" target="_blank"
          >GitHub</a
        >
      </div>
    </div>

    <div class="content-wrapper">
      <div id="swagger-ui"></div>
    </div>

    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
    <script>
      window.onload = function () {
        const ui = SwaggerUIBundle({
          url: "URL_PLACEHOLDER", // This will be replaced by the middleware
          dom_id: "#swagger-ui",
          deepLinking: true,
          presets: [SwaggerUIBundle.presets.apis],
          layout: "BaseLayout", // Use BaseLayout to remove duplicate header
          defaultModelsExpandDepth: 1,
          defaultModelExpandDepth: 1,
          defaultModelRendering: "model",
          displayOperationId: false,
          displayRequestDuration: true,
          docExpansion: "list",
          filter: true,
          showExtensions: false,
          showCommonExtensions: false,
          tagsSorter: "alpha",
        });
        window.ui = ui;
      };
    </script>
  </body>
</html>`;
};

// Custom fancy logger middleware
const fancyLogger = (): MiddlewareHandler => {
  // ANSI color codes
  const reset = "\x1b[0m";
  const bright = "\x1b[1m";
  const dim = "\x1b[2m";

  const black = "\x1b[30m";
  const red = "\x1b[31m";
  const green = "\x1b[32m";
  const yellow = "\x1b[33m";
  const blue = "\x1b[34m";
  const magenta = "\x1b[35m";
  const cyan = "\x1b[36m";
  const white = "\x1b[37m";

  // Background colors
  const bgGreen = "\x1b[42m";
  const bgYellow = "\x1b[43m";
  const bgRed = "\x1b[41m";
  const bgBlue = "\x1b[44m";

  return async (c, next) => {
    const method = c.req.method;
    const path = c.req.path;

    // Get colorized method
    const getMethodColor = (method: string) => {
      switch (method) {
        case "GET":
          return `${bright}${green}${method}${reset}`;
        case "POST":
          return `${bright}${blue}${method}${reset}`;
        case "PUT":
          return `${bright}${yellow}${method}${reset}`;
        case "DELETE":
          return `${bright}${red}${method}${reset}`;
        case "PATCH":
          return `${bright}${magenta}${method}${reset}`;
        case "OPTIONS":
          return `${bright}${cyan}${method}${reset}`;
        default:
          return `${bright}${white}${method}${reset}`;
      }
    };

    // Get status code color
    const getStatusColor = (status: number) => {
      if (status >= 500) {
        return `${bgRed}${bright}${black} ${status} ${reset}`;
      } else if (status >= 400) {
        return `${bgYellow}${bright}${black} ${status} ${reset}`;
      } else if (status >= 300) {
        return `${bgBlue}${bright}${black} ${status} ${reset}`;
      } else if (status >= 200) {
        return `${bgGreen}${bright}${black} ${status} ${reset}`;
      } else {
        return `${bright} ${status} ${reset}`;
      }
    };

    // Log the request
    console.log(
      `${dim}[${new Date().toISOString()}]${reset} ${cyan}⟹${reset}  ${getMethodColor(
        method
      )} ${path}`
    );

    const startTime = Date.now();
    await next();
    const endTime = Date.now();
    const duration = endTime - startTime;

    // Get response status
    const status = c.res.status;

    // Log the response
    console.log(
      `${dim}[${new Date().toISOString()}]${reset} ${green}⟸${reset}  ${getMethodColor(
        method
      )} ${path} ${getStatusColor(status)} ${dim}${duration}ms${reset}`
    );
  };
};

// Apply middleware
app.use("*", fancyLogger());
app.use("*", prettyJSON());
app.use("*", cors());
app.use(
  languageDetector({
    supportedLanguages: ["en", "de", "fr"],
    fallbackLanguage: "en",
  })
);

// Apply timing middleware
app.use(timing());

// Create an OpenAPI instance for the API
const api = new OpenAPIHono();

// Define the OpenAPI document
const openAPIDocument = {
  openapi: "3.1.0",
  info: {
    title: "Product API",
    version: "1.0.0",
    description: "API for managing products and their associated brands",
  },
  servers: [
    {
      url: "/api",
      description: "API endpoint",
    },
  ],
};

// Standard API routes
// Get all products with brand information (with pagination)
api.get("/products", async (c) => {
  try {
    startTime(c, "get-products");

    // Extract pagination parameters from query
    const limitParam = c.req.query("limit");
    const offsetParam = c.req.query("offset");

    // Parse parameters (with fallback to undefined for optional pagination)
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    const offset = offsetParam ? parseInt(offsetParam, 10) : undefined;

    // Get paginated products
    const { data: products, total } = await getProducts(limit, offset);
    endTime(c, "get-products");

    return c.json({
      success: true,
      data: products,
      pagination: {
        total,
        limit,
        offset,
        hasMore:
          limit !== undefined && total > 0
            ? (offset || 0) + limit < total
            : false,
      },
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

// Get product by ID
api.get("/products/:id", async (c) => {
  try {
    const id = c.req.param("id");
    startTime(c, "get-product");
    const product = await getProductById(id);
    endTime(c, "get-product");

    if (!product) {
      return c.json(
        {
          success: false,
          error: "Product not found",
        },
        404
      );
    }

    return c.json({
      success: true,
      data: product,
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

// Add Swagger UI with custom template
api.get(
  "/docs",
  swaggerUI({
    url: "/api/docs/json",
    manuallySwaggerUIHtml: (assets) => {
      return getSwaggerTemplate().replace("URL_PLACEHOLDER", "/api/docs/json");
    },
  })
);

// Serve OpenAPI documentation
api.get("/docs/json", (c) => {
  // Define API paths
  const paths = {
    "/products": {
      get: {
        tags: ["Products"],
        summary: "Get a list of products",
        description:
          "Retrieve a paginated list of products with brand information",
        parameters: [
          {
            name: "limit",
            in: "query",
            description: "Number of items to return per page",
            required: false,
            schema: { type: "string" },
          },
          {
            name: "offset",
            in: "query",
            description: "Starting position for pagination",
            required: false,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Successful response with paginated products",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          name: { type: "string" },
                          description: { type: "string" },
                          price: { type: "number" },
                          brands: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                id: { type: "string" },
                                name: { type: "string" },
                              },
                            },
                          },
                        },
                      },
                    },
                    pagination: {
                      type: "object",
                      properties: {
                        total: { type: "number" },
                        limit: { type: "number", nullable: true },
                        offset: { type: "number", nullable: true },
                        hasMore: { type: "boolean" },
                      },
                    },
                  },
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", enum: [false] },
                    error: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get a product by ID",
        description: "Retrieve a single product by its unique identifier",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Product ID",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Successful response with product details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        description: { type: "string" },
                        price: { type: "number" },
                        brands: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              id: { type: "string" },
                              name: { type: "string" },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "404": {
            description: "Product not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", enum: [false] },
                    error: { type: "string" },
                  },
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", enum: [false] },
                    error: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  // Combine with base OpenAPI document
  const fullDoc = {
    ...openAPIDocument,
    paths,
  };

  return c.json(fullDoc);
});

// Mount the API under /api
app.route("/api", api);

// Home route with custom metrics and API docs link
app.get("/", async (c) => {
  startTime(c, "db");
  await new Promise((resolve) => setTimeout(resolve, 50));
  endTime(c, "db");

  const lang = c.get("language");

  return c.json({
    message: "Welcome to Hono with Bun!",
    language: lang,
    endpoints: {
      api: {
        products: "/api/products",
        productById: "/api/products/:id",
        documentation: "/api/docs",
      },
      root: "/",
    },
  });
});

// For Vercel deployment
const handler = handle(app);
export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const OPTIONS = handler;

// Start local server when not in production/Vercel environment
if (process.env.VERCEL !== "1") {
  const port = process.env.PORT || 3457;
  console.log(`🚀 Server running at http://localhost:${port}`);

  // Create and start the Bun server
  const server = Bun.serve({
    port: Number(port),
    fetch: app.fetch,
  });

  console.log(
    `📚 API Documentation available at http://localhost:${port}/api/docs`
  );
}
