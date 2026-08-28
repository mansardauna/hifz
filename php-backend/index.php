<?php
/**
 * Hifz Quranic Academy Platform - Sample PHP REST API Backend
 * Compatible with PHP 7.4+ & PHP 8.x
 * Supports CORS, JSON API requests, Audio File Uploads, and Database operations.
 */

// 1. Set CORS Headers to accept requests from Next.js frontend
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 2. Parse Route Path & Method
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Helper function for JSON responses
function sendJsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit();
}

// Read raw JSON input body for POST / PUT requests
$rawInput = file_get_contents('php://input');
$inputData = json_decode($rawInput, true) ?? [];

// ------------------------------------------------------------------
// ROUTE 1: GET /api/tenant?subdomain=al-furqan
// ------------------------------------------------------------------
if ($method === 'GET' && strpos($uri, '/api/tenant') !== false) {
    $subdomain = $_GET['subdomain'] ?? 'al-furqan';
    
    // Sample Tenant Config Output (can be queried from PDO MySQL DB)
    $tenantData = [
        "id" => "tenant-" . $subdomain,
        "name" => ucfirst(str_replace('-', ' ', $subdomain)) . " Academy",
        "subdomain" => $subdomain,
        "tagline" => "Empowering Authentic Quranic & Arabic Education",
        "contactEmail" => "admissions@" . $subdomain . ".org",
        "phone" => "+966 50 123 4567",
        "theme" => [
            "primaryColor" => "#047857",
            "primaryHover" => "#065f46",
            "secondaryColor" => "#f59e0b",
            "accentColor" => "#10b981",
            "backgroundColor" => "#f8fafc",
            "surfaceColor" => "#ffffff",
            "textColor" => "#0f172a",
            "borderRadius" => "0.375rem"
        ],
        "defaultDirection" => "ltr"
    ];

    sendJsonResponse(["success" => true, "tenant" => $tenantData]);
}

// ------------------------------------------------------------------
// ROUTE 2: POST /api/leads (Submit Admissions Lead Form)
// ------------------------------------------------------------------
if ($method === 'POST' && strpos($uri, '/api/leads') !== false) {
    $tenantId = $inputData['tenantId'] ?? 'al-furqan';
    $name = $inputData['name'] ?? $inputData['studentName'] ?? 'Anonymous Student';
    $email = $inputData['email'] ?? '';
    $phone = $inputData['phone'] ?? '';
    $courseInterest = $inputData['courseInterest'] ?? 'Intensive Hifz Program';

    $leadId = "lead-" . time();

    // Prepare Lead Record
    $leadRecord = [
        "id" => $leadId,
        "tenantId" => $tenantId,
        "studentName" => $name,
        "name" => $name,
        "email" => $email,
        "phone" => $phone,
        "courseInterest" => $courseInterest,
        "status" => "New",
        "paymentStatus" => "Pending",
        "createdAt" => date('c'),
        "notes" => "Received via PHP API Backend Endpoint"
    ];

    sendJsonResponse([
        "success" => true,
        "leadId" => $leadId,
        "message" => "Application submitted successfully to PHP backend!",
        "lead" => $leadRecord
    ], 201);
}

// ------------------------------------------------------------------
// ROUTE 3: GET /api/leads?tenantId=al-furqan
// ------------------------------------------------------------------
if ($method === 'GET' && strpos($uri, '/api/leads') !== false) {
    $tenantId = $_GET['tenantId'] ?? 'al-furqan';

    $sampleLeads = [
        [
            "id" => "lead-101",
            "tenantId" => $tenantId,
            "studentName" => "Mariam Mansoor",
            "email" => "mariam@example.com",
            "phone" => "+966 54 112 2334",
            "courseInterest" => "Intensive Hifz Program",
            "status" => "Enrolled",
            "paymentStatus" => "Paid",
            "createdAt" => date('c', strtotime('-2 days'))
        ],
        [
            "id" => "lead-102",
            "tenantId" => $tenantId,
            "studentName" => "Youssef Ibrahim",
            "email" => "youssef@example.com",
            "phone" => "+966 50 998 8776",
            "courseInterest" => "Foundational Tajweed Track",
            "status" => "New",
            "paymentStatus" => "Pending",
            "createdAt" => date('c', strtotime('-1 hours'))
        ]
    ];

    sendJsonResponse(["success" => true, "leads" => $sampleLeads]);
}

// ------------------------------------------------------------------
// ROUTE 4: POST /api/recitations/upload (Recitation Homework Audio)
// ------------------------------------------------------------------
if ($method === 'POST' && strpos($uri, '/api/recitations/upload') !== false) {
    $studentId = $_POST['studentId'] ?? 'student-1';
    $studentName = $_POST['studentName'] ?? 'Student Reciter';
    $surahNumber = $_POST['surahNumber'] ?? 1;
    $ayahNumber = $_POST['ayahNumber'] ?? 1;

    $uploadDir = __DIR__ . '/uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $fileUrl = "";
    if (isset($_FILES['audioFile'])) {
        $filename = "recitation_" . time() . "_" . basename($_FILES['audioFile']['name']);
        $targetFile = $uploadDir . $filename;
        if (move_uploaded_file($_FILES['audioFile']['tmp_name'], $targetFile)) {
            $fileUrl = "/uploads/" . $filename;
        }
    }

    sendJsonResponse([
        "success" => true,
        "submission" => [
            "id" => "rec-" . time(),
            "studentId" => $studentId,
            "studentName" => $studentName,
            "surahNumber" => (int)$surahNumber,
            "ayahNumber" => (int)$ayahNumber,
            "audioUrl" => $fileUrl,
            "submittedAt" => date('c'),
            "status" => "pending"
        ]
    ], 201);
}

// Default 404 Fallback for unhandled routes
sendJsonResponse(["success" => false, "message" => "Endpoint not found on PHP API backend"], 404);
