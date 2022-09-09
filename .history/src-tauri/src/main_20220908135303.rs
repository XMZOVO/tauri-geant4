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
    let y = Matrix2x1::new(energy1, energy2);
    let xdata_t = xdata.transpose();
    let xdata_mul = xdata_t * xdata;
    let xdata_inv = xdata_mul.try_inverse().unwrap();

    let py = xdata_inv * xdata_t;
    let p_eff = py * y;
    let a1 = p_eff.row(0).column(0).to_string();
}

extern crate nalgebra as na;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, linear_fit])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
