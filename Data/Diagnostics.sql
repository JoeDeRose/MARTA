SET SQL_BIG_SELECTS = 1;

-- Find instances where the same headsign is used for opposite directions.
SELECT DISTINCT
  R.route_short_name,
  T1.trip_headsign
FROM MARTA_Trips T1
  INNER JOIN MARTA_Trips T2
    ON
      (
        T1.route_id = T2.route_id
        AND T1.trip_headsign = T2.trip_headsign
        AND T2.direction_id = 1
      )
  INNER JOIN MARTA_Routes R
    ON T1.route_id = R.route_id
WHERE T1.direction_id = 0;

-- Find trips where the headsign is blank.
SELECT DISTINCT
  R.route_short_name,
  T.trip_headsign
FROM MARTA_Trips T
  INNER JOIN MARTA_Routes R
    ON T.route_id = R.route_id
WHERE
  TRIM(T.trip_headsign) = "";

-- Find instances where a date appears only once in calendar_dates.
SELECT
  date
FROM MARTA_Calendar_dates
GROUP BY date
HAVING COUNT(*) < 2;