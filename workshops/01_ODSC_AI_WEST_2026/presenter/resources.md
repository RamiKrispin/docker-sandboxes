# Docker Sandboxes workshop resources

The [interactive deck](../slides/index.html) covers agent actions, execution boundaries, Docker socket exposure, useful work inside a microVM, and deliberate sharing. The session finishes teaching by 50:00 and reserves 50:00–60:00 for questions.

## Workshop examples

- [Controlled Docker socket demonstration](../demo/01-docker-socket/runbook.md), with [actual local verification](../demo/01-docker-socket/verification.md).
- [Agent launch preparation](agent-launch.md).
- [Sales dashboard task](../demo/02-agent-streamlit/task-prompt.md), [demo runbook](../demo/02-agent-streamlit/runbook.md), [prepared app](../demo/02-agent-streamlit/expected-output/app.py), and [local fallback](prepared-dashboard.html).
- [Workspace and network checks](../demo/03-access-controls/runbook.md).
- [Preview, keyboard controls, and static export](slides-preview.md).

## Official references

- [Docker Sandboxes installation](https://docs.docker.com/ai/sandboxes/install/)
- [Isolation layers and shared resources](https://docs.docker.com/ai/sandboxes/security/isolation/)
- [Usage, Git workspaces, lifecycle, and published ports](https://docs.docker.com/ai/sandboxes/usage/)
- [Local network policy](https://docs.docker.com/ai/sandboxes/governance/access-controls/local/)
- [Docker Engine security and daemon access](https://docs.docker.com/engine/security/)
- [Streamlit documentation](https://docs.streamlit.io/)

Local assets and prepared examples work without slide-time downloads. Live agent calls and uncached packages/images require the configured connectivity and credentials. Each verification record distinguishes tested behavior from presenter rehearsal still needed.
