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
fn linear_fit(energy1: f32, energy2: f32, efficiency1: f32, efficiency2: f32) -> (String, String) {
    let pi = efficiency1.ln();
    pi.to_string();
    let xdata = Matrix2::new(1.0, efficiency1.ln(), 1.0, efficiency2.ln());
    let y = Matrix2x1::new(energy1.ln(), energy2.ln());
    let xdata_t = xdata.transpose();
    let xdata_mul = xdata_t * xdata;
    let xdata_inv = xdata_mul.try_inverse().unwrap();

    let py = xdata_inv * xdata_t;
    let p_eff = py * y;
    let a1 = p_eff.row(0).column(0).to_string();
    let a2 = p_eff.row(1).column(0).to_string();
    (a1, a2)
}

extern crate nalgebra as na;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, linear_fit])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
