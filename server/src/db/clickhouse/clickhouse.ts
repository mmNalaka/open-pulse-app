import { createClient } from "@clickhouse/client";

export const clickhouse = createClient({
  url: process.env.CLICKHOUSE_HOST,
  database: process.env.CLICKHOUSE_DB,
  password: process.env.CLICKHOUSE_PASSWORD,
  username: process.env.CLICKHOUSE_USER,
});

export const setupClickhouse = async () => {
  try {
    // ============================================
    // 1. ANALYTICS EVENTS TABLE (Raw events)
    // ============================================
    // Stores individual tracking events (pageviews, custom events, errors)
    // session_id matches active_sessions.id from PostgreSQL (server-generated)
    await clickhouse.exec({
      query: `
        CREATE TABLE IF NOT EXISTS analytics_event (
          -- Core identifiers
          timestamp DateTime64(3) DEFAULT now() CODEC(DoubleDelta, ZSTD(1)),
          site_id String,
          session_id String,  -- Matches active_sessions.id (server-generated sess_* UUID)
          user_id Nullable(String),

          -- Page information
          hostname String,
          pathname String,
          querystring Nullable(String),
          page_title Nullable(String),

          -- Referrer (parsed)
          referrer Nullable(String),
          referrer_hostname Nullable(String),
          referrer_pathname Nullable(String),

          -- Device & Browser
          browser LowCardinality(String),
          browser_version LowCardinality(String),
          operating_system LowCardinality(String),
          operating_system_version LowCardinality(String),
          device_type LowCardinality(String),
          screen_width UInt16,
          screen_height UInt16,

          -- Geo & Network
          country LowCardinality(FixedString(2)),
          region LowCardinality(String),
          city Nullable(String),
          lat Nullable(Float64),
          lon Nullable(Float64),
          ip Nullable(String),
          timezone LowCardinality(String) DEFAULT '',

          -- Campaign tracking
          channel LowCardinality(String) DEFAULT 'direct',
          utm_source Nullable(String),
          utm_medium Nullable(String),
          utm_campaign Nullable(String),
          utm_content Nullable(String),
          utm_term Nullable(String),

          -- Event classification
          type LowCardinality(String) DEFAULT 'pageview',
          event_name Nullable(String),

          -- Performance metrics (Web Vitals)
          lcp Nullable(Float64),
          cls Nullable(Float64),
          inp Nullable(Float64),
          fcp Nullable(Float64),
          ttfb Nullable(Float64),

          -- Custom properties
          props Nullable(String)
        )
        ENGINE = MergeTree()
        PARTITION BY toYYYYMM(timestamp)
        ORDER BY (site_id, timestamp, session_id)
        TTL toDateTime(timestamp) + INTERVAL 90 DAY
      `,
    });

    // ============================================
    // 2. ANALYTICS SESSION TABLE (Aggregated)
    // ============================================
    // Stores aggregated session summaries (one row per session)
    // session_id matches active_sessions.id from PostgreSQL (server-generated)
    // Populated by background job aggregating events from analytics_event
    await clickhouse.exec({
      query: `
        CREATE TABLE IF NOT EXISTS analytics_session (
          -- Session identifiers
          session_id String,  -- Matches active_sessions.id (server-generated sess_* UUID)
          site_id String,
          user_id Nullable(String),

          -- Session timing
          session_start DateTime64(3) CODEC(DoubleDelta, ZSTD(1)),
          session_end Nullable(DateTime64(3)) CODEC(DoubleDelta, ZSTD(1)),
          duration_seconds UInt32,

          -- Session navigation
          entry_page String,
          exit_page Nullable(String),
          entry_referrer Nullable(String),

          -- Device & Browser
          browser LowCardinality(String),
          browser_version LowCardinality(String),
          operating_system LowCardinality(String),
          operating_system_version LowCardinality(String),
          device_type LowCardinality(String),
          screen_width UInt16,
          screen_height UInt16,

          -- Geo & Network
          country LowCardinality(FixedString(2)),
          region LowCardinality(String),
          city Nullable(String),
          lat Nullable(Float64),
          lon Nullable(Float64),
          ip Nullable(String),
          timezone LowCardinality(String) DEFAULT '',

          -- Campaign tracking
          channel LowCardinality(String) DEFAULT 'direct',
          utm_source Nullable(String),
          utm_medium Nullable(String),
          utm_campaign Nullable(String),

          -- Engagement metrics
          page_views UInt32,
          custom_events UInt32,
          errors UInt32,

          -- Performance metrics (aggregated)
          avg_lcp Nullable(Float64),
          avg_cls Nullable(Float64),
          avg_inp Nullable(Float64),
          avg_fcp Nullable(Float64),
          avg_ttfb Nullable(Float64),

          -- Session attributes
          language LowCardinality(String),
          is_bounce UInt8,

          -- Metadata
          created_at DateTime DEFAULT now()
        )
        ENGINE = MergeTree()
        PARTITION BY toYYYYMM(session_start)
        ORDER BY (site_id, session_start)
        TTL toDateTime(session_start) + INTERVAL 90 DAY
      `,
    });

    // ============================================
    // 3. ERROR EVENTS TABLE (Optimized for errors)
    // ============================================
    // Stores error events with detailed error information
    // session_id matches active_sessions.id from PostgreSQL (server-generated)
    await clickhouse.exec({
      query: `
        CREATE TABLE IF NOT EXISTS analytics_error (
          timestamp DateTime64(3) DEFAULT now() CODEC(DoubleDelta, ZSTD(1)),
          site_id String,
          session_id String,  -- Matches active_sessions.id (server-generated sess_* UUID)
          user_id Nullable(String),

          -- Error details
          error_type LowCardinality(String),
          error_message String,
          error_stack Nullable(String),
          error_file Nullable(String),
          error_line Nullable(UInt32),
          error_column Nullable(UInt32),

          -- Context
          pathname String,
          hostname String,
          browser LowCardinality(String),
          operating_system LowCardinality(String),

          -- Severity
          severity LowCardinality(String) DEFAULT 'error',

          -- Custom properties
          props Nullable(String)
        )
        ENGINE = MergeTree()
        PARTITION BY toYYYYMM(timestamp)
        ORDER BY (site_id, timestamp, error_type)
        TTL toDateTime(timestamp) + INTERVAL 30 DAY
      `,
    });

    // ============================================
    // 4. HOURLY AGGREGATION TABLE (Pre-computed)
    // ============================================
    // Pre-aggregated hourly metrics for fast dashboard queries
    // Automatically populated by materialized view
    await clickhouse.exec({
      query: `
        CREATE TABLE IF NOT EXISTS analytics_hourly_summary (
          event_hour DateTime,
          site_id String,

          -- Event counts
          pageview_count UInt64,
          custom_event_count UInt64,
          error_count UInt64,
          session_count UInt64,

          -- Engagement
          unique_users UInt64,
          bounce_count UInt64,

          -- Performance
          avg_lcp Nullable(Float64),
          avg_cls Nullable(Float64),
          avg_inp Nullable(Float64),
          avg_fcp Nullable(Float64),
          avg_ttfb Nullable(Float64)
        )
        ENGINE = SummingMergeTree()
        PARTITION BY toYYYYMM(event_hour)
        ORDER BY (site_id, event_hour)
        TTL toDateTime(event_hour) + INTERVAL 60 DAY
      `,
    });

    // ============================================
    // 5. MATERIALIZED VIEW FOR HOURLY AGGREGATION
    // ============================================
    await clickhouse.exec({
      query: `
        CREATE MATERIALIZED VIEW IF NOT EXISTS analytics_hourly_summary_mv
        TO analytics_hourly_summary
        AS SELECT
          toStartOfHour(timestamp) AS event_hour,
          site_id,
          countIf(type = 'pageview') AS pageview_count,
          countIf(type = 'custom_event') AS custom_event_count,
          0 AS error_count,
          uniqExact(session_id) AS session_count,
          uniqExact(user_id) AS unique_users,
          0 AS bounce_count,
          avg(lcp) AS avg_lcp,
          avg(cls) AS avg_cls,
          avg(inp) AS avg_inp,
          avg(fcp) AS avg_fcp,
          avg(ttfb) AS avg_ttfb
        FROM analytics_event
        GROUP BY event_hour, site_id
      `,
    });
  } catch (error) {
    console.error("Failed to setup Clickhouse", error);
    throw error;
  }
};
