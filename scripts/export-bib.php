<?php

// Export the bibliography database to JSON, for the static site build.
// Runs on the server that hosts bib-db-prism, using its own config and connection:
//   node scripts/export-bib.js (npm run export-bib), which checks the output before replacing bib.json

chdir(getenv('HOME') . '/bib-db-prism');
require 'bib_stuff.php';

// pg_fetch_array returns both numeric and named keys: keep the named ones
function named_fields($row)
{
	$res = array();
	foreach ($row as $k => $v) if (!is_int($k)) $res[$k] = $v;
	return $res;
}

$items = array();
foreach (bib_db_query("SELECT * FROM bib_items ORDER BY key") as $row) {
	$item = named_fields($row);
	$item['month'] = $item['month'] ? (int)$item['month'] : null;
	$item['year'] = $item['year'] ? (int)$item['year'] : null;
	$item['cats'] = array_values(array_filter(explode('|', (string)$item['cats'])));
	// PDFs/bibtex live on this server, so resolve them here
	$item['files'] = array();
	foreach (bib_get_item_files($item) as $f) {
		$item['files'][] = array('url' => $f['url'], 'ext' => $f['ext'],
			'size' => array_key_exists('filesize', $f) ? $f['filesize'] : null);
	}
	$items[] = $item;
}

$cats = array();
foreach (bib_db_query("SELECT * FROM bib_cats ORDER BY name") as $row) $cats[] = named_fields($row);

$types = array();
foreach (bib_db_query("SELECT * FROM bib_types ORDER BY type_index") as $row) $types[] = named_fields($row);

echo json_encode(array('exported' => date('c'), 'items' => $items, 'cats' => $cats, 'types' => $types),
	JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT | JSON_INVALID_UTF8_SUBSTITUTE);
echo "\n";
