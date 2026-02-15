# Contributing

Thanks for your interest in improving `@devstool/shadcn-echarts`.

This repository is intentionally focused: it exists to provide a minimal, reliable, production-ready chart component library for React using Apache ECharts and shadcn-style UI patterns.

## Local Setup

### Prerequisites

- Node.js 20+
- pnpm 10+
- Git

### Run Locally

```bash
git clone https://github.com/noobships/shadcn-echarts.git
cd shadcn-echarts
pnpm install
pnpm dev
```

## Contribution Scope

- Keep changes aligned with the library's minimal, typed, and production-ready goals
- Prefer clear APIs over clever abstractions
- Avoid unnecessary dependencies
- Keep docs concise, beginner-friendly, and accurate
- Preserve backward compatibility for exported components when possible

## Before Opening a PR

Run:

```bash
pnpm lint
pnpm type-check
pnpm build
```

If your change touches registry output, also run:

```bash
pnpm registry:build
pnpm registry:verify
```

## Pull Requests

- Use a focused branch per change
- Explain what changed and why
- Include screenshots or recordings for UI-visible changes when relevant
- Link related issues when applicable
- Update docs when behavior or API changes

## Changesets

If your change affects the published npm package, add a changeset:

```bash
pnpm changeset
```

## Contact

Maintained by **[@noobships](https://github.com/noobships)** under the `devstool` brand.

For questions, feedback, or bugs, open an issue:
`https://github.com/noobships/shadcn-echarts/issues`

## License

By contributing, you agree your contributions are licensed under the same MIT License as this project.
