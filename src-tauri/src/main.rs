#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

// #![cfg(target_os = "macos")]
// #![macro_use]
// extern crate objc;


// use tauri::{Manager, WindowEvent};
// use window_ext::WindowExt;

// mod window_ext;

extern crate nalgebra as na;
use na::{Matrix2, Matrix2x1,DMatrix};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
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
    let a1 = p_eff[(0, 0)];
    let a2 = p_eff[(1, 0)];
    (a1, a2)
}

#[tauri::command]
fn quadratic_fit(mut en:Vec<f32>, mut eff:Vec<f32>) -> (f32, f32, f32){
    for i in 0..en.len(){
        en[i] = en[i].ln();
        eff[i] = eff[i].ln();
    }
    let mut xdata = DMatrix::<f32>::zeros(en.len(), 3);
    let mut y = DMatrix::<f32>::zeros(en.len(), 1);
    for i in 0..en.len(){
        xdata[(i, 0)] = 1.0;
        xdata[(i, 1)] = en[i];
        xdata[(i, 2)] = en[i] * en[i];
        y[(i, 0)] = eff[i];
    }
    let xdata_t = &xdata.transpose();
    let xdata_mul = xdata_t * &xdata;
    let xdata_inv = xdata_mul.try_inverse().unwrap();
    let py = xdata_inv * xdata_t;
    let p_eff = py * y;
    let a1 = p_eff[(0, 0)];
    let a2 = p_eff[(1, 0)];
    let a3 = p_eff[(2, 0)];
    (a1, a2, a3)
}

#[tauri::command]
fn eff_cal_line(a1: f32, a2: f32, energy_list: Vec<f32>) -> Vec<f32> {
    let mut eff_vec: Vec<f32> = Vec::new();
    for i in 0..energy_list.len() {
        let eff = (a1 + a2 * energy_list[i].ln()).exp();
        eff_vec.push(eff);
    }
    eff_vec
}

#[tauri::command]
fn eff_cal_quad(a1: f32, a2: f32, a3: f32, energy_list: Vec<f32>) -> Vec<f32> {
    let mut eff_vec: Vec<f32> = Vec::new();
    for i in 0..energy_list.len() {
        let eff = (a1 + a2 * energy_list[i].ln() + a3 * energy_list[i].ln() * energy_list[i].ln()).exp();
        eff_vec.push(eff);
    }
    eff_vec
}

#[tauri::command]
async fn load_local_file(uid_path: String) -> Result<String, String> {
    if std::path::Path::new(uid_path.as_str()).metadata().is_ok() {
        return Ok(uid_path);
    }
    Ok("".into())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, linear_fit, eff_cal_line,load_local_file,quadratic_fit,eff_cal_quad])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


// .setup(|app|{
//     let win = app.get_window("main").unwrap();
//         win.set_transparent_titlebar(true);
//         win.position_traffic_lights(30.0, 30.0);
//         Ok(())
// }).on_window_event(|e| {
//     if let WindowEvent::Resized(..) = e.event() {
//         let win = e.window();
//         win.position_traffic_lights(30., 30.);
//     }
// })
