-- Execute in Toad with F5
SET SQL_BIG_SELECTS = 1;

-- Find instances where the same headsign is used for opposite directions.
-- Execute in Toad with F9
-- REGION
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
--ENDREGION

-- Find trips where the headsign is blank.
-- Execute in Toad with F9
--REGION
SELECT DISTINCT
  R.route_short_name,
  T.trip_headsign
FROM trips T
  INNER JOIN routes R
    ON T.route_id = R.route_id
WHERE
  TRIM(T.trip_headsign) = '';
--ENDREGION

-- Find instances where a date appears only once in calendar_dates.
-- Execute in Toad with F9
--REGION
SELECT
  date
FROM calendar_dates
GROUP BY date
HAVING COUNT(*) < 2;
--ENDREGION

-- Find instances where calendar dates are outside the expected range.
-- Execute in Toad with F9
--REGION
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
--ENDREGION

-- Fix the bad calendar records:
-- Execute in Toad with F5
--REGION
UPDATE calendar
SET
  start_date = :Correct_start_date_YYYYMMDD,
  end_date = :Correct_end_date_YYYYMMDD;
--ENDREGION

COMMIT;

-- Find instances where the arrival_time field in stop_times uses the format #:##:##
-- rather than the standard ##:##:## (i.e., omits the leading zero).
-- Execute in Toad with F9
--REGION
SELECT *
FROM stop_times
WHERE LENGTH( arrival_time ) = 7;
--ENDREGION

-- Fix the bad stop_times records:
-- Execute in Toad with F5
--REGION
UPDATE stop_times
SET arrival_time = CONCAT( '0', arrival_time )
WHERE LENGTH( arrival_time ) = 7;
--ENDREGION

COMMIT;

-- Populate J_rail_stations with new data:
-- Execute in Toad with F5
--REGION
INSERT INTO J_rail_stations
SELECT DISTINCT
  R.route_short_name,
  S.stop_code,
  ST.stop_sequence
FROM routes R
  INNER JOIN trips T
    ON R.route_id = T.route_id
  INNER JOIN stop_times ST
    ON T.trip_id = ST.trip_id
  INNER JOIN stops S
    ON ST.stop_id = S.stop_id
WHERE T.shape_id IN
  (
    SELECT Q2.shape_id
    FROM
      (
        SELECT
          R1.route_short_name,
          MAX( ST1.stop_sequence ) AS longest
        FROM routes R1
          INNER JOIN trips T1
            ON R1.route_id = T1.route_id
          INNER JOIN stop_times ST1
            ON T1.trip_id = ST1.trip_id
        WHERE
          R1.route_short_name in ( 'BLUE', 'GOLD', 'GREEN', 'RED' )
          AND T1.direction_id = 0
        GROUP BY
          R1.route_short_name
      ) Q1
      INNER JOIN
        (
          SELECT DISTINCT
            R2.route_short_name,
            T2.shape_id,
            ST2.stop_sequence
          FROM routes R2
            INNER JOIN trips T2
              ON R2.route_id = T2.route_id
            INNER JOIN stop_times ST2
              ON T2.trip_id = ST2.trip_id
          WHERE
            R2.route_short_name in ( 'BLUE', 'GOLD', 'GREEN', 'RED' )
            AND T2.direction_id = 0
        ) Q2
        ON
          (
            Q1.route_short_name = Q2.route_short_name
            AND Q1.longest = Q2.stop_sequence
          )
  )
ORDER BY
  R.route_short_name,
  ST.stop_sequence;
--ENDREGION

COMMIT;

-- Find stop code for Five Points Station and use it to populate "MARTA\Schedules\modesls\route.php", line 186.
-- Execute in Toad with F9
--REGION
SELECT
  s.stop_name,
  jrs.route_short_name,
  jrs.stop_code
FROM J_rail_stations jrs
INNER JOIN stops s
  ON jrs.stop_code = s.stop_code
WHERE UCASE( s.stop_name = 'FIVE POINTS STATION' )
ORDER BY s.stop_code;
--ENDREGION