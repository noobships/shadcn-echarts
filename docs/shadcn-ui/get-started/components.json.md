# components.json - shadcn/ui

Sections

-   [Introduction](/docs)
-   [Components](/docs/components)
-   [Installation](/docs/installation)
-   [Directory](/docs/directory)
-   [MCP Server](/docs/mcp)
-   [Registry](/docs/registry)
-   [Forms](/docs/forms)
-   [Changelog](/docs/changelog)

Components

-   [Accordion](/docs/components/radix/accordion)
-   [Alert](/docs/components/radix/alert)
-   [Alert Dialog](/docs/components/radix/alert-dialog)
-   [Aspect Ratio](/docs/components/radix/aspect-ratio)
-   [Avatar](/docs/components/radix/avatar)
-   [Badge](/docs/components/radix/badge)
-   [Breadcrumb](/docs/components/radix/breadcrumb)
-   [Button](/docs/components/radix/button)
-   [Button Group](/docs/components/radix/button-group)
-   [Calendar](/docs/components/radix/calendar)
-   [Card](/docs/components/radix/card)
-   [Carousel](/docs/components/radix/carousel)
-   [Chart](/docs/components/radix/chart)
-   [Checkbox](/docs/components/radix/checkbox)
-   [Collapsible](/docs/components/radix/collapsible)
-   [Combobox](/docs/components/radix/combobox)
-   [Command](/docs/components/radix/command)
-   [Context Menu](/docs/components/radix/context-menu)
-   [Data Table](/docs/components/radix/data-table)
-   [Date Picker](/docs/components/radix/date-picker)
-   [Dialog](/docs/components/radix/dialog)
-   [Drawer](/docs/components/radix/drawer)
-   [Dropdown Menu](/docs/components/radix/dropdown-menu)
-   [Empty](/docs/components/radix/empty)
-   [Field](/docs/components/radix/field)
-   [Hover Card](/docs/components/radix/hover-card)
-   [Input](/docs/components/radix/input)
-   [Input Group](/docs/components/radix/input-group)
-   [Input OTP](/docs/components/radix/input-otp)
-   [Item](/docs/components/radix/item)
-   [Kbd](/docs/components/radix/kbd)
-   [Label](/docs/components/radix/label)
-   [Menubar](/docs/components/radix/menubar)
-   [Native Select](/docs/components/radix/native-select)
-   [Navigation Menu](/docs/components/radix/navigation-menu)
-   [Pagination](/docs/components/radix/pagination)
-   [Popover](/docs/components/radix/popover)
-   [Progress](/docs/components/radix/progress)
-   [Radio Group](/docs/components/radix/radio-group)
-   [Resizable](/docs/components/radix/resizable)
-   [Scroll Area](/docs/components/radix/scroll-area)
-   [Select](/docs/components/radix/select)
-   [Separator](/docs/components/radix/separator)
-   [Sheet](/docs/components/radix/sheet)
-   [Sidebar](/docs/components/radix/sidebar)
-   [Skeleton](/docs/components/radix/skeleton)
-   [Slider](/docs/components/radix/slider)
-   [Sonner](/docs/components/radix/sonner)
-   [Spinner](/docs/components/radix/spinner)
-   [Switch](/docs/components/radix/switch)
-   [Table](/docs/components/radix/table)
-   [Tabs](/docs/components/radix/tabs)
-   [Textarea](/docs/components/radix/textarea)
-   [Toast](/docs/components/radix/toast)
-   [Toggle](/docs/components/radix/toggle)
-   [Toggle Group](/docs/components/radix/toggle-group)
-   [Tooltip](/docs/components/radix/tooltip)
-   [Typography](/docs/components/radix/typography)

Get Started

-   [Installation](/docs/installation)
-   [components.json](/docs/components-json)
-   [Theming](/docs/theming)
-   [Dark Mode](/docs/dark-mode)
-   [CLI](/docs/cli)
-   [Monorepo](/docs/monorepo)
-   [Open in v0](/docs/v0)
-   [JavaScript](/docs/javascript)
-   [Blocks](/docs/blocks)
-   [Figma](/docs/figma)
-   [llms.txt](/llms.txt)
-   [Legacy Docs](/docs/legacy)

Forms

-   [React Hook Form](/docs/forms/react-hook-form)
-   [TanStack Form](/docs/forms/tanstack-form)

Registry

-   [Introduction](/docs/registry)
-   [Getting Started](/docs/registry/getting-started)
-   [Namespaces](/docs/registry/namespace)
-   [Authentication](/docs/registry/authentication)
-   [Examples](/docs/registry/examples)
-   [MCP Server](/docs/registry/mcp)
-   [Add a Registry](/docs/registry/registry-index)
-   [Open in v0](/docs/registry/open-in-v0)
-   [registry.json](/docs/registry/registry-json)
-   [registry-item.json](/docs/registry/registry-item-json)

# components.json

Copy Page

[Previous](/docs/installation)[Next](/docs/theming)

Configuration for your project.

The `components.json` file holds configuration for your project.

We use it to understand how your project is set up and how to generate components customized for your project.

Note: The \`components.json\` file is optional

It is **only required if you're using the CLI** to add components to your project. If you're using the copy and paste method, you don't need this file.

You can create a `components.json` file in your project by running the following command:

pnpmnpmyarnbun

```
pnpm dlx shadcn@latest init
```

Copy

See the [CLI section](/docs/cli) for more information.

## $schema

You can see the JSON Schema for `components.json` [here](https://ui.shadcn.com/schema.json).

components.json

Copy`{   "$schema": "https://ui.shadcn.com/schema.json" }`

## style

The style for your components. **This cannot be changed after initialization.**

components.json

Copy`{   "style": "new-york" }`

The `default` style has been deprecated. Use the `new-york` style instead.

## tailwind

Configuration to help the CLI understand how Tailwind CSS is set up in your project.

See the [installation section](/docs/installation) for how to set up Tailwind CSS.

### tailwind.config

Path to where your `tailwind.config.js` file is located. **For Tailwind CSS v4, leave this blank.**

components.json

Copy`{   "tailwind": {     "config": "tailwind.config.js" | "tailwind.config.ts"   } }`

### tailwind.css

Path to the CSS file that imports Tailwind CSS into your project.

components.json

Copy`{   "tailwind": {     "css": "styles/global.css"   } }`

### tailwind.baseColor

This is used to generate the default color palette for your components. **This cannot be changed after initialization.**

components.json

Copy`{   "tailwind": {     "baseColor": "gray" | "neutral" | "slate" | "stone" | "zinc"   } }`

### tailwind.cssVariables

You can choose between using CSS variables or Tailwind CSS utility classes for theming.

To use utility classes for theming set `tailwind.cssVariables` to `false`. For CSS variables, set `tailwind.cssVariables` to `true`.

components.json

Copy``{   "tailwind": {     "cssVariables": `true` | `false`   } }``

For more information, see the [theming docs](/docs/theming).

**This cannot be changed after initialization.** To switch between CSS variables and utility classes, you'll have to delete and re-install your components.

### tailwind.prefix

The prefix to use for your Tailwind CSS utility classes. Components will be added with this prefix.

components.json

Copy`{   "tailwind": {     "prefix": "tw-"   } }`

## rsc

Whether or not to enable support for React Server Components.

The CLI automatically adds a `use client` directive to client components when set to `true`.

components.json

Copy``{   "rsc": `true` | `false` }``

## tsx

Choose between TypeScript or JavaScript components.

Setting this option to `false` allows components to be added as JavaScript with the `.jsx` file extension.

components.json

Copy``{   "tsx": `true` | `false` }``

## aliases

The CLI uses these values and the `paths` config from your `tsconfig.json` or `jsconfig.json` file to place generated components in the correct location.

Path aliases have to be set up in your `tsconfig.json` or `jsconfig.json` file.

**Important:** If you're using the `src` directory, make sure it is included under `paths` in your `tsconfig.json` or `jsconfig.json` file.

### aliases.utils

Import alias for your utility functions.

components.json

Copy`{   "aliases": {     "utils": "@/lib/utils"   } }`

### aliases.components

Import alias for your components.

components.json

Copy`{   "aliases": {     "components": "@/components"   } }`

### aliases.ui

Import alias for `ui` components.

The CLI will use the `aliases.ui` value to determine where to place your `ui` components. Use this config if you want to customize the installation directory for your `ui` components.

components.json

Copy`{   "aliases": {     "ui": "@/app/ui"   } }`

### aliases.lib

Import alias for `lib` functions such as `format-date` or `generate-id`.

components.json

Copy`{   "aliases": {     "lib": "@/lib"   } }`

### aliases.hooks

Import alias for `hooks` such as `use-media-query` or `use-toast`.

components.json

Copy`{   "aliases": {     "hooks": "@/hooks"   } }`

## registries

Configure multiple resource registries for your project. This allows you to install components, libraries, utilities, and other resources from various sources including private registries.

See the [Namespaced Registries](/docs/registry/namespace) documentation for detailed information.

### Basic Configuration

Configure registries with URL templates:

components.json

Copy`{   "registries": {     "@v0": "https://v0.dev/chat/b/{name}",     "@acme": "https://registry.acme.com/{name}.json",     "@internal": "https://internal.company.com/{name}.json"   } }`

The `{name}` placeholder is replaced with the resource name when installing.

### Advanced Configuration with Authentication

For private registries that require authentication:

components.json

Copy`{   "registries": {     "@private": {       "url": "https://api.company.com/registry/{name}.json",       "headers": {         "Authorization": "Bearer ${REGISTRY_TOKEN}",         "X-API-Key": "${API_KEY}"       },       "params": {         "version": "latest"       }     }   } }`

Environment variables in the format `${VAR_NAME}` are automatically expanded from your environment.

### Using Namespaced Registries

Once configured, install resources using the namespace syntax:

Copy`# Install from a configured registry npx shadcn@latest add @v0/dashboard   # Install from private registry npx shadcn@latest add @private/button   # Install multiple resources npx shadcn@latest add @acme/header @internal/auth-utils`

### Example: Multiple Registry Setup

components.json

Copy`{   "registries": {     "@shadcn": "https://ui.shadcn.com/r/{name}.json",     "@company-ui": {       "url": "https://registry.company.com/ui/{name}.json",       "headers": {         "Authorization": "Bearer ${COMPANY_TOKEN}"       }     },     "@team": {       "url": "https://team.company.com/{name}.json",       "params": {         "team": "frontend",         "version": "${REGISTRY_VERSION}"       }     }   } }`

This configuration allows you to:

-   Install public components from shadcn/ui
-   Access private company UI components with authentication
-   Use team-specific resources with versioning

For more information about authentication, see the [Authentication](/docs/registry/authentication) documentation.

[Installation](/docs/installation)[Theming](/docs/theming)

On This Page

[$schema](#schema)[style](#style)[tailwind](#tailwind)[tailwind.config](#tailwindconfig)[tailwind.css](#tailwindcss)[tailwind.baseColor](#tailwindbasecolor)[tailwind.cssVariables](#tailwindcssvariables)[tailwind.prefix](#tailwindprefix)[rsc](#rsc)[tsx](#tsx)[aliases](#aliases)[aliases.utils](#aliasesutils)[aliases.components](#aliasescomponents)[aliases.ui](#aliasesui)[aliases.lib](#aliaseslib)[aliases.hooks](#aliaseshooks)[registries](#registries)[Basic Configuration](#basic-configuration)[Advanced Configuration with Authentication](#advanced-configuration-with-authentication)[Using Namespaced Registries](#using-namespaced-registries)[Example: Multiple Registry Setup](#example-multiple-registry-setup)

Deploy your shadcn/ui app on Vercel

Trusted by OpenAI, Sonos, Adobe, and more.

Vercel provides tools and infrastructure to deploy apps and features at scale.

Deploy Now[Deploy to Vercel](https://vercel.com/new?utm_source=shadcn_site&utm_medium=web&utm_campaign=docs_cta_deploy_now_callout)