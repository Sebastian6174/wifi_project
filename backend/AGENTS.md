# agents.md — WiFi Público Cali: Multi-Agent System

## Project Overview

A Python-based multi-agent system that monitors, analyzes, and reports on Cali's public WiFi access points. It ingests data from the city's open data APIs, normalizes it into a local SQL database, and runs three specialized agents: one operational (anomaly detection + work orders), one conversational (natural language Q&A), and one strategic (infrastructure expansion recommendations).

---

## Data Sources

All data originates from Cali's open data portal (`datos.cali.gov.co`) via GET requests to a CKAN Datastore API.

| Dataset | Type | Endpoint |
|---|---|---|
| General WiFi zone info | Static (geolocation, metadata) | `https://datos.cali.gov.co/api/3/action/datastore_search?resource_id=dbe631ec-92ed-46d0-86ea-98224cbffe32` |
| Connected users / zone status | Dynamic (usage, state) | `https://datos.cali.gov.co/api/3/action/datastore_search?resource_id=c6f9b4b5-914d-4c58-985d-02d72b815919` |

> **Ingestion note:** The system must be flexible. In competition conditions the data may arrive as a SQL service, a CSV with timestamped records, or a JSON endpoint. The ingestion layer must handle all three and normalize everything into a local SQL database before any agent touches it.

---

## Architecture

```
[ Data Source ]
  REST API / CSV / SQL
        │
        ▼
[ Ingestion Layer ]
  Parse → Normalize → SQLite / PostgreSQL
        │
        ├──────────────────────────────────┐
        ▼                                  ▼
[ Operational Agent ]         [ Strategic Agent ]
  Scheduled / on data update    Scheduled (periodic)
  Anomaly detection             Infrastructure analysis
  Work order generation         Generates Markdown reports
  Operator assignment           Suggests new AP locations
        │
        ▼
[ Reports DB ]
  (SQL — shared with conversational agent)
        │
        ▼
[ Conversational Agent ]
  Triggered on user message
  Answers only from data
  Access: WiFi DB + Reports DB + Operators DB
        │
        ▼
[ Web UI ]
  Operator registry
  Work order dashboard
  Strategic reports viewer
  Map (current + suggested APs)
  Chat interface
```

---

## Agents

### 1. Operational Agent

**Trigger:** Scheduled interval or on data update event.

**Responsibilities:**
- Query the dynamic dataset for anomalies (unexpected downtime, abnormal usage spikes, status changes).
- Apply contextual reasoning — the same low-usage reading at 3 AM is not an anomaly, but it might be at noon on a weekday.
- Generate structured work orders with: detected anomaly, affected zone, severity, and which operators are best suited to resolve it.
- Persist reports and assignments to the SQL database.
---

### 2. Conversational Agent

**Trigger:** User message via the web UI chat.

**Responsibilities:**
- Answer questions about WiFi zones, current status, usage stats, operators, and existing reports.
- Strictly data-grounded — if the information is not in the database, it says so. No hallucination.
- Read access to: WiFi zones DB, dynamic records DB, reports DB, operators DB.

---

### 3. Strategic Agent

**Trigger:** Periodic schedule (e.g., weekly or monthly).

**Responsibilities:**
- Analyze geolocation data and historical usage patterns across all zones.
- Identify underserved areas, overloaded zones, and infrastructure gaps.
- Output Markdown files with findings, coverage maps, and expansion recommendations (including suggested coordinates for new access points).
- Persist reports to the DB so the web UI and conversational agent can access them.

---

## Database Schema (Reference)

```sql
-- Static zone info
-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.tecnicos (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  nombre text,
  especialidad text,
  CONSTRAINT tecnicos_pkey PRIMARY KEY (id)
);

CREATE TABLE public.tickets (
  id bigint NOT NULL,
  tipo_anomalia text,
  descripcion text,
  estado text,
  id_tecnico bigint NOT NULL,
  created_at timestamp with time zone,
  resuelto_en date,
  wifi_point_id bigint,
  CONSTRAINT tickets_pkey PRIMARY KEY (id),
  CONSTRAINT tickets_wifi_point_id_fkey FOREIGN KEY (wifi_point_id) REFERENCES public.wifi_points(id),
  CONSTRAINT tickets_id_tecnico_fkey FOREIGN KEY (id_tecnico) REFERENCES public.tecnicos(id)
);

CREATE TABLE public.wifi_points (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  NOMBRE ZONA text,
  DIRECCION text,
  BARRIO text,
  COMUNA bigint,
  CODIGO bigint,
  CORREO ELECTRÓNICO text,
  LATITUD bigint,
  LONGITUD bigint,
  PROVEEDOR CONECTIVIDAD text,
  VELOCIDAD text,
  HORARIOS text,
  CONSTRAINT wifi_points_pkey PRIMARY KEY (id)
);

CREATE TABLE public.wifi_usage (
  FECHA CONEXION date,
  AREA text,
  NOMBRE ZONA text,
  COMUNA text,
  MODEL text,
  NUMERO CONEXIONES bigint,
  USAGE (kB) bigint,
  PORCENTAJE USO text,
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  CONSTRAINT wifi_usage_pkey PRIMARY KEY (id)
);
```

---

## Web UI Features

| Section | Description |
|---|---|
| **Operator Registry** | Add, edit, and deactivate operators. Stored in SQL. |
| **Work Orders Dashboard** | View AI-generated reports, assigned operator, severity, and resolution status. |
| **Strategic Reports** | Rendered Markdown reports from the Strategic Agent. |
| **Map** | Interactive map showing current AP locations and AI-suggested expansion points. |
| **Chat** | Interface to talk with the Conversational Agent. |

---

## Key Design Decisions

- **SQL as the single source of truth** — all agents read/write to SQL. No agent calls the external API directly after ingestion.
- **Context-aware anomaly detection** — the Operational Agent must factor in time of day and day of week before flagging anomalies, not just raw thresholds.
- **Data-grounded conversational agent** — the Conversational Agent is intentionally restricted to what exists in the DB. It does not speculate.
- **Flexible ingestion** — the ingestion layer is decoupled from agents so it can adapt to whatever data format is provided at competition time.