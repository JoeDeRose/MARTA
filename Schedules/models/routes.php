<?php
function get_routes() {

	global $mysqli;
	
	$ServiceID = _getServiceID();

	// HEREDOC ------------------------------------------------------------------------
	$query = <<<QUERY_ROUTE_INFO

SELECT DISTINCT
  Q1.route_type,
  Q1.route_short_name,
  Q1.route_long_name,
  Q1.route_color,
  MAX( Q1.RunsToday ) AS RunsToday
FROM
  (
    SELECT
      R.route_type,
      R.route_short_name,
      R.route_long_name,
      R.route_color,
      CASE T.service_id
        WHEN {$ServiceID} THEN 1
        ELSE 0
      END AS RunsToday
    FROM routes R
      INNER JOIN trips T
        ON R.route_id = T.route_id
    WHERE R.route_type = 3
  ) Q1
GROUP BY
  Q1.route_short_name,
  Q1.route_long_name,
  Q1.route_color
ORDER BY
  Q1.route_type,
  CONVERT( Q1.route_short_name, DECIMAL ),
  Q1.route_short_name;

QUERY_ROUTE_INFO;
	// --------------------------------------------------------------------------------

	$routes = $mysqli->query($query);
	
	return $routes;

}
?>
