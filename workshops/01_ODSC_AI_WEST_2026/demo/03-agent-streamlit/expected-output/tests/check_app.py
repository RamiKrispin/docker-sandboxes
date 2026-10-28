"""Check the prepared dashboard with Streamlit's application test runner."""
from pathlib import Path

from streamlit.testing.v1 import AppTest

app = AppTest.from_file(str(Path(__file__).parents[1] / "app.py")).run(timeout=20)
assert not app.exception
assert app.metric[0].value == "$19,000"
assert len(app.dataframe[0].value) == 12
app.multiselect[0].set_value(["West"]).run()
assert app.metric[0].value == "$10,500"
app.multiselect[1].set_value(["Notebook"]).run()
assert app.metric[0].value == "$4,200"
assert len(app.dataframe[0].value) == 3
app.multiselect[0].set_value([]).run()
assert app.metric[0].value == "$0"
assert len(app.info) == 1
assert not app.exception
print("PASS: totals, both filters, displayed rows, and empty-selection guidance")
