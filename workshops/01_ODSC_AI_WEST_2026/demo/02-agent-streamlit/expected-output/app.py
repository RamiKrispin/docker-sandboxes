from pathlib import Path

import pandas as pd
import streamlit as st

DATA = Path(__file__).parent / "data/sales.csv"

st.set_page_config(page_title="Workshop sales", layout="wide")
st.title("Workshop sales dashboard")
st.caption("Prepared example · synthetic sales data")
df = pd.read_csv(DATA, parse_dates=["date"])
regions = st.multiselect("Region", df.region.unique(), df.region.unique())
product_choices = df["product"].unique()
products = st.multiselect("Product", product_choices, product_choices)
filtered = df[df.region.isin(regions) & df["product"].isin(products)]
st.metric("Total revenue", f"${filtered.revenue.sum():,.0f}")
if filtered.empty:
    st.info("Choose at least one region and product with matching rows.")
else:
    trend = filtered.groupby("date", as_index=False).revenue.sum()
    regional = filtered.groupby("region", as_index=False).revenue.sum()
    left, right = st.columns(2)
    with left:
        st.subheader("Revenue over time")
        st.line_chart(trend, x="date", y="revenue")
    with right:
        st.subheader("Revenue by region")
        st.bar_chart(regional, x="region", y="revenue")
st.dataframe(filtered, hide_index=True)
