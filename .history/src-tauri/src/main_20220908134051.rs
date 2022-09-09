#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use na::{Matrix2, Matrix2x1};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn linear_fit(energy1: f32, energy2: f32, efficiency1: f32, efficiency2: f32) {
    let xdata = Matrix2::new(1.0, 1.0, efficiency1.ln(), efficiency2.ln());
    let ydata = Matrix2x1::new(energy1, energy1);
}

extern crate nalgebra as na;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, linear_fit])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
