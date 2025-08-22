<?php

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Cache;

$flask = rtrim(env('FLASK_SERVICE_URL', 'http://127.0.0.1:5001'), '/');

Route::get('/health', fn() => Http::get("$flask/health")->json());

Route::get('/sensor-alert', function () use ($flask) {
    // Same JSON shape frontend expects: { sensor_alerts: [...] }
    return Http::get("$flask/sensor-alert")->json();
});

Route::get('/rfid-scan', function () use ($flask) {
    return Http::get("$flask/rfid-scan")->json();
});

Route::get('/sales', function () use ($flask) {
    // Optional tiny cache to avoid hammering Flask
    return Cache::remember('sales:latest', now()->addSeconds(30), function () use ($flask) {
        return Http::get("$flask/sales")->json();
    });
});

Route::get('/predict-demand', function () use ($flask) {
    return Cache::remember('predict:latest', now()->addSeconds(30), function () use ($flask) {
        return Http::get("$flask/predict-demand")->json();
    });
});

