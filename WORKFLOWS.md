# GitHub Actions Workflows for Claude Code Router

This repository includes several GitHub Actions workflows that integrate Claude AI for automated code review and assistance.

## Available Workflows

### 1. Claude Code (`claude.yaml`)
**Trigger**: Issue comments with `@claude`, pushes to main, PRs to main, manual dispatch, daily schedule
**Purpose**: Interactive Claude assistance for general queries and code help
**Usage**: Comment `@claude` followed by your question in any issue or PR

### 2. Claude Auto Review (`claude-auto-review.yml`)
**Trigger**: When PRs are opened or updated
**Purpose**: Automatic comprehensive code review
**Features**:
- Code quality analysis
- Security vulnerability detection
- Performance considerations
- Test coverage assessment
- Documentation review

### 3. Claude Path-Specific Review (`claude-pr-path-specific.yml`)
**Trigger**: PRs that modify specific file types (JS, TS, TSX files in `src/` and `ui/`)
**Purpose**: Focused review for critical source code changes
**Benefits**: Reduces noise by only reviewing important file changes

### 4. Claude Mode Examples (`claude-modes.yml`)
**Trigger**: Multiple events (comments, issues, PRs, manual, scheduled)
**Purpose**: Demonstrates two operational modes:
- **Tag Mode**: Responds to `@claude` mentions in comments/issues
- **Agent Mode**: Automated tasks via manual dispatch or schedule

## Setup Requirements

1. **GitHub Secret**: Add `OPENAI_API_KEY` to your repository secrets
2. **Router Configuration**: Workflows use `https://anyrouter.top` as the API endpoint
3. **Permissions**: Workflows have appropriate read/write permissions for PRs and issues

## How Users Can Interact

### For Developers
- **Get Code Help**: Comment `@claude` in any issue or PR with your question
- **Request Reviews**: Open a PR to trigger automatic reviews
- **Manual Tasks**: Use "Run workflow" button for agent mode tasks

### For Maintainers
- **Monitor Reviews**: Check Actions tab for workflow execution status
- **Customize Prompts**: Edit workflow files to adjust review criteria
- **Schedule Tasks**: Agent mode runs weekly for maintenance tasks

## What to Expect

### Automatic Reviews Will:
- Analyze code quality and best practices
- Identify potential bugs and security issues
- Suggest performance improvements
- Check test coverage
- Provide inline comments on specific code sections

### Interactive Claude Will:
- Answer questions about the codebase
- Help with debugging issues
- Suggest implementation approaches
- Explain complex code sections
- Assist with documentation

### Agent Mode Will:
- Check for outdated dependencies
- Scan for security vulnerabilities
- Create issues for critical problems found
- Perform scheduled maintenance tasks

## Workflow Architecture

All workflows follow this pattern:
1. **Setup**: Install Bun runtime and create router configuration
2. **Start Router**: Launch claude-code-router on port 3456
3. **Execute**: Run Claude Code action through the local router
4. **Route**: Router forwards requests to configured API endpoint

This architecture allows using your custom API endpoints while maintaining compatibility with the official Claude Code action.