import { createClient } from "@clickhouse/client";

export const clickhouse = createClient({
  url: process.env.CLICKHOUSE_HOST,
  database: process.env.CLICKHOUSE_DB,
  password: process.env.CLICKHOUSE_PASSWORD,
  username: process.env.CLICKHOUSE_USER,
});

export const setupClickhouse = async () => {
  try {
    // Setup Clickhouse schema
    await clickhouse.exec({
      query: `
      CREATE TABLE IF NOT EXISTS analytics_event (
        timestamp DateTime64(3) DEFAULT now() CODEC(DoubleDelta, ZSTD(1)),
        site_id String,
        session_id String,
        user_id String,
        hostname String,
        pathname String,
        querystring String,
        url_params String,
        page_title String,
        referrer String,
        referrer_hostname String,
        referrer_pathname String,
        channel String,
        browser LowCardinality(String),
        browser_version LowCardinality(String),
        operating_system LowCardinality(String),
        operating_system_version LowCardinality(String),
        language LowCardinality(String),
        country LowCardinality(FixedString(2)),
        region LowCardinality(String),
        city String,
        lat Float64,
        lon Float64,
        lcp Nullable(Float64),
        cls Nullable(Float64),
        inp Nullable(Float64),
        fcp Nullable(Float64),
        ttfb Nullable(Float64),
        ip Nullable(String),
        timezone LowCardinality(String) DEFAULT '',
        screen_width UInt16,
        screen_height UInt16,
        device_type LowCardinality(String),
        type LowCardinality(String) DEFAULT 'pageview',
        event_name String,
        props JSON
      ) ENGINE = MergeTree()
      PARTITION BY toYYYYMM(timestamp)
      ORDER BY (site_id, timestamp)
    `,
    });
  } catch (error) {
    console.error("Failed to setup Clickhouse", error);
    throw error;
  }
};
