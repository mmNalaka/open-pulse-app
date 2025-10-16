import { createClient } from "@clickhouse/client";

export const clickhouse = createClient({
  url: process.env.CLICKHOUSE_HOST,
  database: process.env.CLICKHOUSE_DB,
  password: process.env.CLICKHOUSE_PASSWORD,
  username: process.env.CLICKHOUSE_USER,
});

export const setupClickhouse = async () => {
  // Setup Clickhouse schema
  await clickhouse.exec({
    query: `
      CREATE TABLE IF NOT EXISTS analytics_event (
        timestamp DateTime64(3) CODEC(DoubleDelta, ZSTD(1)) DEFAULT now(),
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
        ip String,
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
};
