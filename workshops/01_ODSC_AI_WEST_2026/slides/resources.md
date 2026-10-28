# Docker Sandboxes workshop resources

The [interactive deck](../slides/index.html) covers agent actions, execution boundaries, Docker socket exposure, useful work inside a microVM, and deliberate sharing. The session finishes teaching by 50:00 and reserves 50:00–60:00 for questions.

## Workshop examples

- [Controlled Docker socket demonstration](../demo/01-docker-socket/runbook.md), with [actual local verification](../demo/01-docker-socket/verification.md).
- [Docker Sandboxes command reference](../demo/02-getting-started/getting-started.md).
- [Demo 02 — Getting started](../demo/02-getting-started/README.md).
- [Sales dashboard task](../demo/03-agent-streamlit/task-prompt.md), [hands-on guide](../demo/03-agent-streamlit/README.md), [prepared app](../demo/03-agent-streamlit/expected-output/app.py), and [local fallback](../demo/03-agent-streamlit/fallback/prepared-dashboard.html).
- [Optional workspace and network extension](../demo/extensions/access-controls/runbook.md).
- [Slide setup and keyboard controls](../README.md#set-up-the-slide-deck).

## Official references

- [Docker Sandboxes installation](https://docs.docker.com/ai/sandboxes/install/)
- [Isolation layers and shared resources](https://docs.docker.com/ai/sandboxes/security/isolation/)
- [Usage, Git workspaces, lifecycle, and published ports](https://docs.docker.com/ai/sandboxes/usage/)
- [Local network policy](https://docs.docker.com/ai/sandboxes/governance/access-controls/local/)
- [Docker Engine security and daemon access](https://docs.docker.com/engine/security/)
- [Streamlit documentation](https://docs.streamlit.io/)

Local assets and prepared examples work without slide-time downloads. Live agent calls and uncached packages/images require the configured connectivity and credentials. Each verification record distinguishes tested behavior from presenter rehearsal still needed.
