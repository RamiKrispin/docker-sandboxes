# Running AI Agents Safely with Docker Sandboxes — Workshop Spec

**Status:** Complete 17-slide deck built and checked; authenticated sandbox rehearsal remains pending  
**Updated:** October 17, 2026

## Overview

- **Title:** Running AI Agents Safely with Docker Sandboxes
- **Audience:** Data scientists, analysts, AI practitioners, and developers new to sandboxing.
- **Prerequisites:** Basic familiarity with a terminal, Python, and project files or Git. Docker familiarity is helpful but optional; no prior sandbox, microVM, Streamlit, or security experience is required. The presenter prepares Docker Sandboxes, authentication, and demo fixtures beforehand.
- **Goal:** Explain agent execution boundaries, demonstrate the Docker socket mechanism, build a toy Streamlit app with a sandboxed agent, and verify workspace/network access.
- **Format:** 60-minute conference workshop: 50 minutes of content/demos, followed by ten minutes of Q&A.
- **Profile:** design-principles voice and visual defaults, adapted to the supplied brief's comics and Reveal.js engine.
- **Build mode:** The user requested completion of the remaining deck. Independent content QA and browser/print QA apply before delivery.
- **Slide split:** One combined 17-slide deck at `slides/index.html`.
- **Topic READMEs:** Off by default. Later demo runbooks follow the supplied brief.
- **Output root:** `workshops/01_ODSC_AI_WEST_2026/`, explicitly selected by the user; no output-path discovery is needed.

## Source of truth

Use the [development brief](../docker_sandboxes_ai_agents_workshop_development_plan.md) for workshop scope and the [deck plan](deck-plan.md) for slide content, interactions, code highlight sequences, timing, and acceptance criteria. [Agenda](agenda.md), [continuity](continuity.md), and [open items](open-items.md) support staged implementation. Resolve conflicting implementation details against the approved plan and current official documentation before building.

## Requirements

- Begin with why agents need sandboxing, then introduce isolation, the socket demonstration, sandbox architecture, the app build, and access controls.
- Deliver HTML with meaningful interaction, syntax highlighting, and presenter-controlled emphasis that moves through code components.
- Budget 20 minutes of live demos: six minutes for the socket demo, eight within the nine-minute app segment, and six for access controls. Finish all content and takeaways by 50:00; reserve 50:00–60:00 for Q&A. Keep readable 16:9 layouts, local assets, speaker notes, reduced-motion alternatives, and static/video fallbacks.
- Use a prepared sandbox and cached dependencies/images for the app demo. Limit live generation to two minutes and the code walkthrough to selected filter/start components; switch promptly to validated results if needed.
- Use sanitized fixtures and accurately describe intentional sharing. No absolute security claims or implication that every container exposes a host socket.
- No license material without an explicit request. No narration scripts or unrelated tutorial edits.

## Implementation status

All 17 slides are built in the combined HTML deck. Independent topic QA, two-viewport browser checks, direct-file offline checks, and the 17-page print export pass. The controlled socket demonstration is verified on the local Docker Desktop engine. The prepared Streamlit application is verified locally with AppTest and a host Docker/browser run. Authenticated agent launch, sandbox port publishing, workspace enforcement, and network-policy enforcement remain rehearsal tasks. Reveal.js 6.0.2 and Inter 5.3.0 are pinned and bundled for offline use.

| Topic | Slides | Planned supporting location | Build status |
| --- | --- | --- | --- |
| 01 — Why sandbox | 01–05 | `slides/`, comic assets | built; QA passed; continued by user request |
| 02 — Isolation levels | 06–07 | `slides/`, architecture assets | built; QA passed; continued by user request |
| 03 — Socket exposure | 08–09 | `demo/01-docker-socket/` | built; demo verified; QA passed; continued by user request |
| 04 — Architecture and launch | 10–12 | `slides/`, architecture assets, launch runbook | built; QA passed; launch syntax checked |
| 05 — Agent builds an app | 13 | `demo/02-agent-streamlit/` | built; prepared app verified locally; QA passed |
| 06 — Access controls | 14–15 | `demo/03-access-controls/` | built; command syntax checked; QA passed; live enforcement rehearsal pending |
| 07 — Wrap-up | 16–17 | `slides/`, presenter handout | built; QA passed |

**Current delivery:** The complete 17-slide deck includes the architecture and launch walkthrough, prepared app/code hub, workspace and network controls, evidence capture, decision guide, and final Q&A slide. Prepared or predicted material is labeled as such; the deck does not claim an authenticated sandbox run. No section-divider slides are added to the brief's route. Preview instructions: [presenter/slides-preview.md](../presenter/slides-preview.md).
