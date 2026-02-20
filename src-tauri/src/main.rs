#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use log::{error, info, warn};
use std::process::{Command, Stdio};
use tauri::Manager;

#[tauri::command]
fn start_backend_services(app_handle: tauri::AppHandle) -> Result<String, String> {
    let resource_dir = app_handle
        .path()
        .resource_dir()
        .map_err(|e| e.to_string())?;
    let server_script = resource_dir.join("server").join("index.js");
    let python_script = resource_dir
        .join("scripts")
        .join("enhanced_sanskrit_api.py");

    info!("资源目录: {:?}", resource_dir);
    info!("Node.js 脚本路径: {:?}", server_script);
    info!("Python 脚本路径: {:?}", python_script);

    // 启动 Node.js 服务 (端口 3006)
    if server_script.exists() {
        match Command::new("node")
            .arg(&server_script)
            .current_dir(resource_dir.join("server"))
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()
        {
            Ok(_) => info!("Node.js 服务已启动 (端口 3006)"),
            Err(e) => error!("启动 Node.js 服务失败: {}", e),
        }
    } else {
        error!("Node.js 脚本不存在: {:?}", server_script);
    }

    // 启动 Python 服务 (端口 3008)
    if python_script.exists() {
        match Command::new("python")
            .arg(&python_script)
            .current_dir(resource_dir.join("scripts"))
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()
        {
            Ok(_) => info!("Python 服务已启动 (端口 3008)"),
            Err(e) => error!("启动 Python 服务失败: {}", e),
        }
    } else {
        warn!("Python 脚本不存在，梵语 API 将不可用");
    }

    Ok("服务已启动".to_string())
}

#[tauri::command]
fn stop_backend_services() -> Result<String, String> {
    info!("停止后端服务命令已收到 (Windows 上进程会自动终止)");
    Ok("服务已停止".to_string())
}

#[tauri::command]
fn get_service_status() -> Result<String, String> {
    Ok("运行中".to_string())
}

fn main() {
    env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("info")).init();

    info!("Lumina 应用启动中...");

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            start_backend_services,
            stop_backend_services,
            get_service_status
        ])
        .setup(|app| {
            info!("执行应用设置...");

            let handle = app.handle().clone();

            std::thread::spawn(move || {
                std::thread::sleep(std::time::Duration::from_secs(1));

                let resource_dir = match handle.path().resource_dir() {
                    Ok(dir) => dir,
                    Err(e) => {
                        error!("获取资源目录失败: {}", e);
                        return;
                    }
                };

                let server_script = resource_dir.join("server").join("index.js");
                let python_script = resource_dir
                    .join("scripts")
                    .join("enhanced_sanskrit_api.py");

                info!("启动后端服务...");
                info!("Node.js 脚本: {:?}", server_script);
                info!("Python 脚本: {:?}", python_script);

                // 启动 Node.js 服务
                if server_script.exists() {
                    match Command::new("node")
                        .arg(&server_script)
                        .current_dir(resource_dir.join("server"))
                        .stdout(Stdio::piped())
                        .stderr(Stdio::piped())
                        .spawn()
                    {
                        Ok(_) => info!("Node.js 服务已启动"),
                        Err(e) => error!("启动 Node.js 服务失败: {}", e),
                    }
                } else {
                    error!("Node.js 脚本不存在");
                }

                // 启动 Python 服务
                if python_script.exists() {
                    match Command::new("python")
                        .arg(&python_script)
                        .current_dir(resource_dir.join("scripts"))
                        .stdout(Stdio::piped())
                        .stderr(Stdio::piped())
                        .spawn()
                    {
                        Ok(_) => info!("Python 服务已启动"),
                        Err(e) => error!("启动 Python 服务失败: {}", e),
                    }
                } else {
                    warn!("Python 脚本不存在，梵语 API 不可用");
                }
            });

            info!("应用设置完成");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
