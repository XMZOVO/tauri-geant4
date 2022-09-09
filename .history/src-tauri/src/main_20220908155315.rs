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
fn linear_fit(energy1: f32, energy2: f32, efficiency1: f32, efficiency2: f32) -> (f32, f32) {
    let xdata = Matrix2::new(1.0, energy1.ln(), 1.0, energy2.ln());
    let y = Matrix2x1::new(efficiency1.ln(), efficiency2.ln());

    let xdata_t = xdata.transpose();
    let xdata_mul = xdata_t * xdata;
    let xdata_inv = xdata_mul.try_inverse().unwrap();

    let py = xdata_inv * xdata_t;
    let p_eff = py * y;
    println!("{}", p_eff.to_string());
    let a1 = p_eff[(0, 0)];
    let a2 = p_eff[(1, 0)];
    (a1, a2)
}

#[tauri::command]
fn eff_cal_line(a1: f32, a2: f32, energy_list: Vec<f32>) -> Vec<f32> {
    println!("{}", a1);
    let mut eff_vec: Vec<f32> = Vec::new();
    for i in 0..energy_list.len() {
        let eff = (a1 + a2 * energy_list[i]).exp();
        eff_vec.push(eff);
    }
    eff_vec
}

extern crate nalgebra as na;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, linear_fit, eff_cal_line])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
