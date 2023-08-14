<?php
require 'vendor/autoload.php';

putenv('GOOGLE_APPLICATION_CREDENTIALS=./key.json');


function getFromSheet($sheetId, $range)
{
	$client = new Google_Client();
	$client->useApplicationDefaultCredentials();
	$client->setScopes([Google_Service_Sheets::SPREADSHEETS]);
	$service = new Google_Service_Sheets($client);

	$response = $service->spreadsheets_values->get($sheetId, $range);
	$values = $response->getValues();

	if (empty($values)) return [];

	$result = [];

	foreach ($values as $row) {
		$result[$row[0] . "." . $row[1]] = [
			"ko" => $row[2],
			"en" => $row[3],
			"jp" => $row[4]
		];
	}

	return $result;
}

function getFromDB()
{
	return [
		"common.vorpal" => [
			"ko" => "보-팔",
			"en" => "Vorpal",
			"jp" => "보팔(일어치기귀찮)"
		],
		"detail.okizeme" => [
			"ko" => "오키제메",
			"en" => "Okizeme",
			"jp" => "おきぜめ"
		]
	];
}

function compare($fromData, $toData)
{
	$new = [];
	$update = [];

	foreach ($fromData as $key => $value) {
		if (!isset($toData[$key])) {
			$new[$key] = $value;
		} else {
			$diff = array_diff($value, $toData[$key]);
			if (count($diff) > 0) {
				$update[$key] = $diff;
			}
		}
	}

	echo "<h1>새로 추가될 키</h1>";
	foreach ($new as $key => $value) {
		$jsonValue = json_encode($value, JSON_UNESCAPED_UNICODE);
		echo "$key: $jsonValue\n";
	}

	echo "<h1>업데이트될 키</h1>";
	foreach ($update as $key => $value) {
		$jsonValue = json_encode($value, JSON_UNESCAPED_UNICODE);

		echo "$key: $jsonValue\n";
	}
}

function writeToDB()
{
	//
}

function sayHello($name)
{
	echo "Hello $name!";
}

function test()
{
	$jsonText = '{
		"ko": {
			"hello": "안녕하세요"
		},
		"en": {
			"hello": "Hello"
		},
		"ja": {
			"hello": "こんにちは"
		}
	}';
	$i18n = json_decode($jsonText, true);
}

?>

<html>

<head>
	<title>Visual Studio Code Remote :: PHP</title>
</head>

<body>
	<?php
		$sheetData = getFromSheet("1MPP3fGsdRdrziT4g4SR97bIpP0gNlOKTosjmVeOU4k8", "translate!A2:E");
		$dbData = getFromDB();
		compare($sheetData, $dbData);
	?>
</body>

</html>