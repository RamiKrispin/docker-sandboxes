# Workshop Title

Running AI Agents Safely with Docker Sandboxes

# Session Abstract

AI coding agents can write applications, install dependencies, modify files, and build containers. These capabilities make them useful partners for data teams, but they also raise a practical question: what should an agent be allowed to access while it works?

This beginner-friendly workshop introduces Docker Sandboxes as a way to run coding agents inside microVM-based environments with their own Docker engine. We begin with agent actions and execution boundaries, compare containers with microVMs, and demonstrate how intentionally sharing a host Docker socket changes what a containerized agent can do. The emphasis is on understanding the access we grant and verifying its effects.

Next, we walk through a coding agent building a small Streamlit sales dashboard from a synthetic CSV dataset. Attendees will see how the agent reads data, creates filters and charts, packages the application, and makes it accessible in a host browser. We then compare direct workspace access with a separate Git clone and inspect network rules using permitted and explicitly denied requests.

Attendees will learn to select an execution environment, scope shared resources, and distinguish intended restrictions from observed behavior. These skills apply to data scientists, analysts, AI engineers, and developers in retail, financial services, healthcare, and technology who use agents for exploratory analysis, internal applications, and development automation. Python code, Dockerfiles, sample data, and demo commands will be shared through GitHub and explained during the session. Basic terminal and Python familiarity is helpful; prior sandboxing experience is unnecessary.

# Session Outline

**Format:** 60-minute presenter-led workshop, including live demonstrations, interactive predictions, code walkthroughs, and ten minutes of Q&A. Installation and authentication are prepared before the session.

## Module 1 — Agent actions and execution boundaries (0–10 minutes)

**Learning objective:** Identify which resources an agent needs for a task and explain why repeated approval prompts should be complemented by deliberate execution boundaries.

**Activities and materials:** Interactive diagrams connect commands, file edits, dependency installation, and Docker builds to the resources they affect. Attendees predict the access needed for a sample dashboard task. An animated approval-fatigue example introduces the motivation for sandboxing.

## Module 2 — Containers, microVMs, and Docker socket access (10–26 minutes)

**Learning objective:** Compare isolation mechanisms and explain how sharing a Docker socket gives a client access to the daemon's capabilities.

**Activities and materials:** Compare direct execution, operating-system restrictions, containers, and microVMs. Walk through a controlled Docker demonstration in which a socket-enabled client asks the host daemon to launch another container that reads a harmless fixture file. Explain the command components and distinguish intentional sharing from a kernel exploit.

**Tools:** Docker Engine, Docker CLI, and Docker Desktop for the macOS demonstration; shell commands and a disposable text fixture shared through GitHub.

## Module 3 — Build and serve a sandboxed data application (26–42 minutes)

**Learning objective:** Explain the sandbox's separate Docker engine, interpret the agent launch command, and trace a data application from CSV input to a host browser.

**Activities and materials:** Walk through Docker Sandboxes architecture and launch a prepared coding-agent environment. Use a synthetic sales CSV with date, region, product, and revenue columns to build a Streamlit dashboard with filters, a revenue metric, a time trend, and a regional chart. Review the Python filter expression, Dockerfile, build/run commands, and container-to-sandbox-to-host port mappings. Time-box live generation and retain a prepared application fallback.

**Tools and project:** Docker Sandboxes (`sbx`), a compatible coding agent such as Codex, Python, pandas, Streamlit, and Docker. Share the CSV, task prompt, Python source, requirements, Dockerfile, and commands through GitHub.

## Module 4 — Verify access and choose an environment (42–50 minutes)

**Learning objective:** Compare workspace write behavior, distinguish policy decisions from actual network requests, and choose an execution environment appropriate to a task's access needs.

**Activities and materials:** Compare direct and clone workspaces using a sanitized Git fixture and harmless marker edits. Show that clone mode separates edits while its source remains readable. Inspect sandbox-scoped network rules, compare an allowed request with an explicitly denied request, and discuss cleanup and preservation of wanted changes. Close with an environment-selection guide.

**Tools:** Docker Sandboxes CLI, Git, curl, and the shared workspace/network demonstration runbook.

**Q&A (50–60 minutes):** Revisit code, architecture diagrams, and practitioner use cases. No additional teaching module is scheduled in this block.

# Learning Objectives and Tools

After this session, attendees will be able to:

- Map a coding agent's actions to the files, processes, network destinations, credentials, and Docker capabilities it needs.
- Explain the difference between container and microVM isolation, including the effect of sharing a host Docker socket.
- Interpret the commands used to launch a sandboxed agent, build a containerized data app, and publish its service to a host browser.
- Compare direct and clone workspace behavior without assuming that a readable source repository hides secrets.
- Inspect network policy and distinguish a policy-check decision from evidence produced by an actual request.
- Apply these distinctions when choosing an execution environment for data analysis, internal applications, and development automation.

**Open-source tools:** Python, pandas, Streamlit, Docker Engine, Docker CLI, Git, and curl.

**Additional platforms and components:** Docker Sandboxes and its `sbx` CLI; Docker Desktop for the macOS socket demonstration; a compatible coding agent such as Codex; and GitHub for sharing code and supporting materials. Coding-agent access may require separate authentication and a provider account.

**Shared materials:** Python source files, synthetic CSV data, Dockerfiles, pinned application requirements, task prompts, demo commands, and runbooks. Code is explained through live and highlighted slide walkthroughs; attendees can reuse the examples after the workshop.
