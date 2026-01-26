# AGENT CONTEXT - READ ON EVERY SESSION

This file contains mandatory rules for any AI agent working on this project.

================================================================================
MANDATORY SKILLS (Apply Automatically)
================================================================================

1. REACT BEST PRACTICES
   - Location: .agent/skills/vercel-react-best-practices/SKILL.md
   - When: ALL React/Next.js code (components, hooks, pages, data fetching)
   - Action: Read SKILL.md and apply relevant rules from the rules/ folder

2. FRONTEND DESIGN
   - Location: .agent/skills/frontend-design/SKILL.md
   - When: ALL UI/UX work (styling, layouts, components, design systems)
   - Action: Read SKILL.md and follow its design principles

================================================================================
MANDATORY REFERENCES
================================================================================

3. DOCUMENTATION
   - Location: docs/
   - When: Before implementing features or fixing bugs
   - Action: Check for relevant documentation (Tiptap, React Email, etc.)

4. DEPENDENCIES
   - Location: package.json
   - When: Start of any coding session or before adding packages
   - Action: Read to understand installed packages, prefer existing over new

================================================================================
WORKFLOW
================================================================================

For detailed rules, see: .agent/workflows/project-rules.md
Invoke with: /project-rules

================================================================================
QUICK CHECKLIST
================================================================================

[ ] Read package.json for dependency context
[ ] Check docs/ for relevant documentation
[ ] Apply vercel-react-best-practices for React/Next.js code
[ ] Apply frontend-design skill for UI/UX work
[ ] Validate against existing codebase patterns
