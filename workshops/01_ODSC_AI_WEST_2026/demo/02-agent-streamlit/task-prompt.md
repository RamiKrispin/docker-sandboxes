Build a small Streamlit dashboard using data/sales.csv. This is synthetic data
with columns date, region, product, and revenue. Add region and product filters,
total revenue, a revenue time trend, and a regional revenue chart. Handle an
empty filter result gracefully. Keep all data local; do not add uploads,
authentication, external APIs, or a database.

Create app.py, pinned requirements.txt, and a Dockerfile in this workspace.
Make Streamlit listen on 0.0.0.0:8501. Build an image named odsc-sales:workshop
with this sandbox's Docker engine and run its container named odsc-sales with
-p 8501:8501. Test a filter, report which files changed and the exact build/run
commands, and leave the container running. Do not modify expected-output/.

The presenter publishes sandbox port 8501 separately from the host terminal.
These instructions describe the task; sandbox configuration enforces access.
