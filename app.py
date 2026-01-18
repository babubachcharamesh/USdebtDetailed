
import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import datetime
import time

# --- CONFIGURATION ---
st.set_page_config(
    page_title="DebtPulse US | National Debt Analytics",
    page_icon="🇺🇸",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# --- CUSTOM CSS (Injecting the React-style Aesthetics) ---
st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
    
    .main {
        background-color: #020617;
    }
    
    html, body, [data-testid="stAppViewContainer"] {
        font-family: 'Space Grotesk', sans-serif;
        background-color: #020617;
        color: #f8fafc;
    }
    
    .mono {
        font-family: 'JetBrains Mono', monospace;
    }
    
    .stMarkdown p {
        color: #94a3b8;
    }
    
    /* Glassmorphism Cards */
    div[data-testid="stVerticalBlock"] > div.element-container {
        /* Styling generic containers for cards */
    }
    
    .glass-card {
        background: rgba(15, 23, 42, 0.6);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 24px;
        padding: 2rem;
        margin-bottom: 1.5rem;
    }
    
    .amber-text { color: #fbbf24; }
    .blue-text { color: #3b82f6; }
    .emerald-text { color: #10b981; }
    
    .big-clock {
        font-size: 4rem;
        font-weight: 700;
        letter-spacing: -0.05em;
        color: #ffffff;
        text-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
        margin: 1rem 0;
    }
    
    /* Metrics Styling */
    [data-testid="stMetricValue"] {
        font-size: 2.2rem !important;
        font-weight: 700 !important;
        color: #ffffff !important;
    }
    
    .burden-badge {
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        padding: 0.2rem 0.6rem;
        border-radius: 12px;
        display: inline-block;
        margin-bottom: 0.5rem;
    }
    
    .burden-critical { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
    .burden-high { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
    
    /* Custom Sidebar/Tabs Styling */
    .stTabs [data-baseweb="tab-list"] {
        gap: 10px;
        background-color: transparent;
    }
    .stTabs [data-baseweb="tab"] {
        height: 50px;
        background-color: #0f172a;
        border-radius: 12px;
        color: #94a3b8;
        padding: 0 24px;
        border: 1px solid rgba(255,255,255,0.1);
    }
    .stTabs [aria-selected="true"] {
        background-color: #fbbf24 !important;
        color: #020617 !important;
        font-weight: 700;
    }
    </style>
    """, unsafe_allow_html=True)

# --- CONSTANTS & DATA ---
BASE_DEBT = 34500000000000 
DEBT_GROWTH_PER_SEC = 45000
US_POP = 336000000
US_TAXPAYERS = 168000000
US_MEDIAN_INCOME = 77397

HISTORICAL_DATA = pd.DataFrame([
    {"Year": "2014", "Total": 17.8, "Public": 12.8, "Intragov": 5.0, "GDP_Ratio": 101.5},
    {"Year": "2015", "Total": 18.1, "Public": 13.1, "Intragov": 5.0, "GDP_Ratio": 100.8},
    {"Year": "2016", "Total": 19.5, "Public": 14.4, "Intragov": 5.1, "GDP_Ratio": 105.2},
    {"Year": "2017", "Total": 20.2, "Public": 14.7, "Intragov": 5.5, "GDP_Ratio": 103.8},
    {"Year": "2018", "Total": 21.5, "Public": 15.8, "Intragov": 5.7, "GDP_Ratio": 104.3},
    {"Year": "2019", "Total": 22.7, "Public": 17.1, "Intragov": 5.6, "GDP_Ratio": 106.9},
    {"Year": "2020", "Total": 26.9, "Public": 21.0, "Intragov": 5.9, "GDP_Ratio": 126.3},
    {"Year": "2021", "Total": 28.4, "Public": 22.3, "Intragov": 6.1, "GDP_Ratio": 121.5},
    {"Year": "2022", "Total": 30.9, "Public": 24.3, "Intragov": 6.6, "GDP_Ratio": 120.2},
    {"Year": "2023", "Total": 33.1, "Public": 26.5, "Intragov": 6.6, "GDP_Ratio": 122.1},
    {"Year": "2024", "Total": 34.5, "Public": 27.8, "Intragov": 6.7, "GDP_Ratio": 123.5},
])

OWNERSHIP_DATA = pd.DataFrame([
    {"Holder": "Foreign Governments", "Amount": 8.1, "Color": "#3b82f6"},
    {"Holder": "Federal Reserve", "Amount": 4.8, "Color": "#10b981"},
    {"Holder": "Mutual Funds", "Amount": 3.1, "Color": "#8b5cf6"},
    {"Holder": "Pension Funds", "Amount": 2.8, "Color": "#f59e0b"},
    {"Holder": "Banks/Financials", "Amount": 2.2, "Color": "#ef4444"},
    {"Holder": "Other Private", "Amount": 6.8, "Color": "#64748b"},
    {"Holder": "Intragovernmental", "Amount": 6.7, "Color": "#f472b6"},
])

SPENDING_DATA = pd.DataFrame([
    {"Category": "Social Security", "Amount": 1.45, "Mandatory": True},
    {"Category": "Net Interest", "Amount": 0.89, "Mandatory": True},
    {"Category": "Medicare", "Amount": 0.92, "Mandatory": True},
    {"Category": "Defense", "Amount": 0.82, "Mandatory": False},
    {"Category": "Health", "Amount": 0.75, "Mandatory": True},
    {"Category": "Income Security", "Amount": 0.58, "Mandatory": True},
    {"Category": "Veterans", "Amount": 0.32, "Mandatory": False},
    {"Category": "Other Discretionary", "Amount": 0.94, "Mandatory": False},
]).sort_values("Amount", ascending=True)

FOREIGN_HOLDERS = pd.DataFrame([
    {"ID": "JP", "Name": "Japan", "Amount": 1.15, "Lat": 36.2, "Lon": 138.2},
    {"ID": "CN", "Name": "China", "Amount": 0.77, "Lat": 35.8, "Lon": 104.1},
    {"ID": "GB", "Name": "United Kingdom", "Amount": 0.71, "Lat": 55.3, "Lon": -3.4},
    {"ID": "LU", "Name": "Luxembourg", "Amount": 0.37, "Lat": 49.8, "Lon": 6.1},
    {"ID": "CA", "Name": "Canada", "Amount": 0.34, "Lat": 56.1, "Lon": -106.3},
    {"ID": "IE", "Name": "Ireland", "Amount": 0.30, "Lat": 53.4, "Lon": -8.2},
    {"ID": "BE", "Name": "Belgium", "Amount": 0.30, "Lat": 50.5, "Lon": 4.4},
    {"ID": "CH", "Name": "Switzerland", "Amount": 0.28, "Lat": 46.8, "Lon": 8.2},
    {"ID": "FR", "Name": "France", "Amount": 0.26, "Lat": 46.2, "Lon": 2.2},
    {"ID": "BR", "Name": "Brazil", "Amount": 0.23, "Lat": -14.2, "Lon": -51.9},
])

# --- SESSION STATE FOR THE CLOCK ---
if 'start_time' not in st.session_state:
    st.session_state.start_time = time.time()

# --- HEADER ---
col_h1, col_h2 = st.columns([2, 1])
with col_h1:
    st.markdown('<h1 style="margin-bottom:0;">DebtPulse <span style="color:#fbbf24;">US</span></h1>', unsafe_allow_html=True)
    st.markdown('<p style="letter-spacing:0.2em; font-weight:700; color:#475569; font-size:0.7rem; text-transform:uppercase;">Fiscal Intelligence Unit</p>', unsafe_allow_html=True)
with col_h2:
    st.markdown("""
        <div style="text-align: right; padding-top: 10px;">
            <span style="color:#ef4444; font-weight:700; font-size:0.6rem; text-transform:uppercase; animation: pulse-gold 2s infinite;">Critical Alert</span><br/>
            <span style="color:#94a3b8; font-size:0.8rem; font-family:monospace;">Debt Ceiling: Suspended</span>
        </div>
    """, unsafe_allow_html=True)

# --- HERO SECTION & LIVE CLOCK ---
st.markdown("""
    <div style="margin: 2rem 0;">
        <h2 style="font-size: 2.5rem; font-weight: 700; color: #f1f5f9;">Demystifying the <span style="background: linear-gradient(to right, #fbbf24, #f59e0b, #ef4444); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Great Ledger</span></h2>
        <p style="font-size: 1.1rem; color: #94a3b8; max-width: 700px;">Every second, the United States financial obligation shifts. Explore where the money comes from, where it goes, and what it means for the future.</p>
    </div>
""", unsafe_allow_html=True)

# THE LIVE ESTIMATOR
clock_container = st.empty()

def update_clock():
    elapsed = time.time() - st.session_state.start_time
    current_debt = BASE_DEBT + (elapsed * DEBT_GROWTH_PER_SEC)
    
    per_citizen = current_debt / US_POP
    per_taxpayer = current_debt / US_TAXPAYERS
    
    citizen_ratio = (per_citizen / US_MEDIAN_INCOME) * 100
    taxpayer_ratio = (per_taxpayer / US_MEDIAN_INCOME) * 100
    
    with clock_container.container():
        st.markdown(f'<div style="text-align:center;"><p style="color:#fbbf24; font-weight:700; text-transform:uppercase; font-size:0.8rem; letter-spacing:0.1em; margin-bottom:-10px;">Live National Debt Estimate</p></div>', unsafe_allow_html=True)
        st.markdown(f'<div style="text-align:center;" class="mono big-clock">${current_debt:,.0f}</div>', unsafe_allow_html=True)
        
        c1, c2 = st.columns(2)
        with c1:
            st.markdown(f"""
                <div class="glass-card">
                    <div class="burden-badge burden-high">High Burden</div>
                    <p style="text-transform:uppercase; font-size:0.7rem; font-weight:700; color:#64748b; margin:0;">Debt Per Citizen</p>
                    <h3 style="font-size:2.2rem; margin:0.5rem 0;">${per_citizen:,.0f}</h3>
                    <p style="font-size:0.7rem; color:#475569;">Debt-to-Income Ratio: <span style="color:#3b82f6; font-weight:700;">{citizen_ratio:.1f}%</span></p>
                    <div style="height:6px; background:#1e293b; border-radius:3px; overflow:hidden;">
                        <div style="height:100%; width:{min(citizen_ratio, 100)}%; background:#3b82f6;"></div>
                    </div>
                </div>
            """, unsafe_allow_html=True)
            
        with c2:
            st.markdown(f"""
                <div class="glass-card">
                    <div class="burden-badge burden-critical">Critical Burden</div>
                    <p style="text-transform:uppercase; font-size:0.7rem; font-weight:700; color:#64748b; margin:0;">Debt Per Taxpayer</p>
                    <h3 style="font-size:2.2rem; margin:0.5rem 0;">${per_taxpayer:,.0f}</h3>
                    <p style="font-size:0.7rem; color:#475569;">Debt-to-Income Ratio: <span style="color:#fbbf24; font-weight:700;">{taxpayer_ratio:.1f}%</span></p>
                    <div style="height:6px; background:#1e293b; border-radius:3px; overflow:hidden;">
                        <div style="height:100%; width:{min(taxpayer_ratio/3, 100)}%; background:#fbbf24;"></div>
                    </div>
                </div>
            """, unsafe_allow_html=True)

# TABS NAVIGATION
tab_overview, tab_global = st.tabs(["📊 Overview & Analysis", "🌍 Global Distribution"])

with tab_overview:
    # Row 1: Historical Growth
    st.markdown('<h3 style="margin-top:2rem;">Decade of Debt (Trillions USD)</h3>', unsafe_allow_html=True)
    
    fig_hist = px.area(
        HISTORICAL_DATA, 
        x="Year", 
        y=["Public", "Intragov"],
        color_discrete_map={"Public": "#3b82f6", "Intragov": "#f472b6"},
        template="plotly_dark"
    )
    fig_hist.update_layout(
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        margin=dict(l=20, r=20, t=20, b=20),
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1)
    )
    st.plotly_chart(fig_hist, use_container_width=True)
    
    # Row 2: Distribution & GDP
    col_dist, col_gdp = st.columns([1, 1])
    
    with col_dist:
        st.markdown('<h3>Debt Ownership</h3>', unsafe_allow_html=True)
        fig_pie = px.pie(
            OWNERSHIP_DATA, 
            values="Amount", 
            names="Holder", 
            hole=0.5,
            color_discrete_sequence=OWNERSHIP_DATA["Color"].tolist(),
            template="plotly_dark"
        )
        fig_pie.update_layout(paper_bgcolor='rgba(0,0,0,0)', margin=dict(l=10, r=10, t=10, b=10))
        st.plotly_chart(fig_pie, use_container_width=True)
        
    with col_gdp:
        st.markdown('<h3>Debt-to-GDP Evolution</h3>', unsafe_allow_html=True)
        fig_bar = px.bar(
            HISTORICAL_DATA, 
            x="Year", 
            y="GDP_Ratio",
            template="plotly_dark",
            color_discrete_sequence=["#10b981"]
        )
        fig_bar.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)', margin=dict(l=20, r=20, t=20, b=20))
        st.plotly_chart(fig_bar, use_container_width=True)

    # Row 3: Spending Outlays
    st.markdown('<h3>Annual Outlays: Where the Money Goes</h3>', unsafe_allow_html=True)
    fig_spend = px.bar(
        SPENDING_DATA,
        x="Amount",
        y="Category",
        orientation="h",
        color="Mandatory",
        color_discrete_map={True: "#ef4444", False: "#3b82f6"},
        template="plotly_dark",
        labels={"Amount": "Amount (Trillions USD)"}
    )
    fig_spend.update_layout(
        paper_bgcolor='rgba(0,0,0,0)', 
        plot_bgcolor='rgba(0,0,0,0)', 
        showlegend=False,
        margin=dict(l=20, r=20, t=20, b=20)
    )
    st.plotly_chart(fig_spend, use_container_width=True)

with tab_global:
    st.markdown('<h3>International Creditor Map</h3>', unsafe_allow_html=True)
    st.markdown('<p>Visualizing the foreign nations that fund the US deficit. Hover for detailed holdings.</p>', unsafe_allow_html=True)
    
    fig_map = px.scatter_geo(
        FOREIGN_HOLDERS,
        lat="Lat",
        lon="Lon",
        hover_name="Name",
        size="Amount",
        template="plotly_dark",
        color_discrete_sequence=["#fbbf24"],
        projection="natural earth"
    )
    
    fig_map.update_geos(
        showcountries=True, 
        countrycolor="#1e293b",
        showocean=True, 
        oceancolor="#020617",
        showland=True, 
        landcolor="#0f172a"
    )
    
    fig_map.update_layout(
        margin=dict(l=0, r=0, t=0, b=0),
        paper_bgcolor='rgba(0,0,0,0)',
        height=600
    )
    
    st.plotly_chart(fig_map, use_container_width=True)
    
    # Detailed Registry Table
    st.markdown('<h4>Top Foreign Creditors Registry</h4>', unsafe_allow_html=True)
    st.dataframe(
        FOREIGN_HOLDERS[["Name", "Amount"]].rename(columns={"Amount": "Amount (Trillions USD)"}),
        use_container_width=True,
        hide_index=True
    )

# --- FOOTER ---
st.markdown("---")
f1, f2, f3 = st.columns(3)
with f1:
    st.markdown("🌐 **Data Source**: Treasury.gov (TIC Data)")
with f2:
    st.markdown("📅 **Reporting Period**: Late 2024 Estimates")
with f3:
    if st.button("📥 Export Historical Ledger (.csv)"):
        csv = HISTORICAL_DATA.to_csv(index=False).encode('utf-8')
        st.download_button(
            label="Confirm Download",
            data=csv,
            file_name="US_National_Debt_Ledger.csv",
            mime="text/csv"
        )

# --- TRIGGER THE CLOCK ---
update_clock()
time.sleep(1)
st.rerun()
