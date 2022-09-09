#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn linear_fit() {
    println!("I was invoked from JS!");
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, linear_fit])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
