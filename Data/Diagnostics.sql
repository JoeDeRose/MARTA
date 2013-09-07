SET SQL_BIG_SELECTS = 1;

-- Find instances where the same headsign is used for opposite directions.
SELECT DISTINCT
  R.route_short_name,
  T1.trip_headsign
FROM trips T1
  INNER JOIN trips T2
    ON
      (
        T1.route_id = T2.route_id
        AND T1.trip_headsign = T2.trip_headsign
        AND trim( T1.trip_headsign ) <> ''
        AND T2.direction_id = 1
      )
  INNER JOIN routes R
    ON T1.route_id = R.route_id
WHERE T1.direction_id = 0;

-- Find trips where the headsign is blank.
SELECT DISTINCT
  R.route_short_name,
  T.trip_headsign
FROM trips T
  INNER JOIN routes R
    ON T.route_id = R.route_id
WHERE
  TRIM(T.trip_headsign) = '';

-- Find instances where a date appears only once in calendar_dates.
SELECT
  date
FROM calendar_dates
GROUP BY date
HAVING COUNT(*) < 2;

-- Find instances where calendar dates are outside the expected range.
SELECT
  start_date,
  DATEDIFF
    (
      CONCAT_WS( '-', SUBSTRING( start_date, 1, 4), SUBSTRING( start_date, 5, 2), SUBSTRING( start_date, 7) ),
      DATE_FORMAT( NOW(), '%Y-%m-%d' )
    ) AS start_date_diff,
  CASE
    WHEN DATEDIFF
      (
        CONCAT_WS( '-', SUBSTRING( start_date, 1, 4), SUBSTRING( start_date, 5, 2), SUBSTRING( start_date, 7) ),
        DATE_FORMAT( NOW(), '%Y-%m-%d' )
      ) > 0 THEN 'ERROR: start_date is in the future'
    ELSE 'OK: start_date is in the past'
  END AS start_date_result,
  end_date,
  DATEDIFF
    (
      CONCAT_WS( '-', SUBSTRING( end_date, 1, 4), SUBSTRING( end_date, 5, 2), SUBSTRING( end_date, 7) ),
      DATE_FORMAT( NOW(), '%Y-%m-%d' )
    ) AS end_date_diff,
  CASE
    WHEN DATEDIFF
      (
        CONCAT_WS( '-', SUBSTRING( end_date, 1, 4), SUBSTRING( end_date, 5, 2), SUBSTRING( end_date, 7) ),
        DATE_FORMAT( NOW(), '%Y-%m-%d' )
      ) < 0 THEN 'ERROR: end_date is in the past'
    WHEN DATEDIFF
      (
        CONCAT_WS( '-', SUBSTRING( end_date, 1, 4), SUBSTRING( end_date, 5, 2), SUBSTRING( end_date, 7) ),
        DATE_FORMAT( NOW(), '%Y-%m-%d' )
      ) > 180 THEN 'ERROR: end_date is more than 180 days in the future'
    ELSE 'OK: end_date is between 0 and 180 days in the future'
  END AS end_date_result
FROM calendar;

-- Fix the bad calendar records:
UPDATE calendar
SET
  start_date = :Correct_start_date_YYYYMMDD,
  end_date = :Correct_end_date_YYYYMMDD;

-- Find instances where the arrival_time field in stop_times uses the format #:##:##
-- rather than the standard ##:##:## (i.e., omits the leading zero).
SELECT *
FROM stop_times
WHERE LENGTH( arrival_time ) = 7;

-- Fix the bad stop_times records:
UPDATE stop_times
SET arrival_time = CONCAT( '0', arrival_time )
WHERE LENGTH( arrival_time ) = 7;

COMMIT;
