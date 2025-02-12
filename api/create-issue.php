<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['description']) || empty($data['description'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Description is required']);
    exit();
}

$github_token = getenv('GITHUB_TOKEN');
if (!$github_token) {
    http_response_code(500);
    echo json_encode(['error' => 'GitHub token not configured']);
    exit();
}

$ch = curl_init('https://api.github.com/repos/TabacWiki/TabacWiki/issues');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: token ' . $github_token,
    'User-Agent: TabacWiki-Issue-Reporter',
    'Accept: application/vnd.github.v3+json',
    'Content-Type: application/json'
]);

$issue_data = [
    'title' => 'User Reported Issue: ' . date('Y-m-d'),
    'body' => $data['description'],
    'labels' => ['user-reported']
];

curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($issue_data));

$response = curl_exec($ch);
$status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($status_code === 201) {
    $response_data = json_decode($response, true);
    echo json_encode([
        'message' => 'Issue created successfully',
        'issueUrl' => $response_data['html_url']
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to create issue',
        'details' => $response
    ]);
}
