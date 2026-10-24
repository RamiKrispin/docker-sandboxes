# Prepared sales application verification

**Checked:** October 17, 2026  
**Scope:** Prepared application only. These checks do not establish an authenticated agent run, sandbox execution, or sandbox-to-host port publishing.

## Application checks

The prepared application uses Streamlit 1.50.0 and pandas 2.3.3. Running `python check_app.py` from this demo directory passed the AppTest checks for:

- all 12 rows: **$19,000** total revenue;
- West: **$10,500**;
- West plus Notebook: **$4,200** across three rows;
- an empty selection: **$0** with guidance instead of a chart exception.

The local HTML fallback was also exercised: selecting West and Notebook changes the total from $19,000 to $4,200 and updates the trend.

## Container check

The image built successfully from `expected-output/Dockerfile`. The resulting local image ID was:

```text
sha256:4a45fedd3b6829ec8690898c1ae6a219c2737b475974cf76a7fbf50a0d7d5bd3
```

A host Docker container served the prepared Streamlit app through an ephemeral loopback port. Browser checks confirmed the default dashboard and the West/Notebook filtered result. This validates the prepared app, image, listening address, and container port mapping on the host test setup.

## Still to rehearse

- authenticate the selected coding agent and start the named sandbox;
- build or load the image in the sandbox's separate Docker engine;
- confirm the container-to-sandbox mapping and `sbx ports` assigned host binding;
- verify service lifetime while the agent session is attached or detached;
- record the exact live versions, port output, and cleanup steps on conference hardware.
