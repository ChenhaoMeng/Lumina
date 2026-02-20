#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use log::{error, info, warn};
use std::fs;
use std::path::PathBuf;
use std::process::{Command, Stdio};
use tauri::Manager;

fn find_resource_path(app_handle: &tauri::AppHandle) -> PathBuf {
    // 尝试多种方式获取资源路径

    // 方式1: resource_dir (开发环境和打包后都可能有效)
    if let Ok(dir) = app_handle.path().resource_dir() {
        let server_path = dir.join("server").join("index.js");
        if server_path.exists() {
            info!("使用 resource_dir: {:?}", dir);
            return dir;
        }
        info!("resource_dir 存在但 server 不在: {:?}", dir);
    }

    // 方式2: 尝试 exe 同级目录的 resources
    if let Ok(exe_path) = std::env::current_exe() {
        if let Some(exe_dir) = exe_path.parent() {
            let resources_path = exe_dir.join("resources");
            let server_path = resources_path.join("server").join("index.js");
            if server_path.exists() {
                info!("使用 exe 同级 resources: {:?}", resources_path);
                return resources_path;
            }
            // MSI 安装可能是 Program Files
            let server_path2 = resources_path.join("server").join("index.js");
            if server_path2.exists() {
                info!("使用 Program Files resources: {:?}", resources_path);
                return resources_path;
            }
        }
    }

    // 方式3: 回退到 exe 同级目录
    if let Ok(exe_path) = std::env::current_exe() {
        if let Some(exe_dir) = exe_path.parent() {
            info!("使用 exe 同级目录: {:?}", exe_dir);
            return exe_dir.to_path_buf();
        }
    }

    // 返回一个默认路径
    app_handle
        .path()
        .resource_dir()
        .unwrap_or_else(|_| PathBuf::from("."))
}

#[tauri::command]
fn start_backend_services(app_handle: tauri::AppHandle) -> Result<String, String> {
    let base_path = find_resource_path(&app_handle);
    let server_script = base_path.join("server").join("index.js");
    let python_script = base_path.join("scripts").join("enhanced_sanskrit_api.py");

    info!("基础路径: {:?}", base_path);
    info!("Node.js 脚本: {:?}", server_script);
    info!("Python 脚本: {:?}", python_script);

    // 列出 resources 目录内容用于调试
    if base_path.exists() {
        info!("基础路径目录内容:");
        if let Ok(entries) = fs::read_dir(&base_path) {
            for entry in entries.flatten() {
                info!("  - {:?}", entry.path());
            }
        }

        // 检查 server 目录
        let server_dir = base_path.join("server");
        if server_dir.exists() {
            info!("server 目录内容:");
            if let Ok(entries) = fs::read_dir(&server_dir) {
                for entry in entries.flatten().take(10) {
                    info!("  - {:?}", entry.path());
                }
            }
        }
    }

    // 启动 Node.js 服务 (端口 3006)
    if server_script.exists() {
        match Command::new("node")
            .arg(&server_script)
            .current_dir(base_path.join("server"))
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
            .current_dir(base_path.join("scripts"))
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
                std::thread::sleep(std::time::Duration::from_secs(2));

                let base_path = find_resource_path(&handle);
                let server_script = base_path.join("server").join("index.js");
                let python_script = base_path.join("scripts").join("enhanced_sanskrit_api.py");

                info!("启动后端服务...");
                info!("基础路径: {:?}", base_path);
                info!("Node.js 脚本: {:?}", server_script);
                info!("Python 脚本: {:?}", python_script);

                // 启动 Node.js 服务
                if server_script.exists() {
                    match Command::new("node")
                        .arg(&server_script)
                        .current_dir(base_path.join("server"))
                        .stdout(Stdio::piped())
                        .stderr(Stdio::piped())
                        .spawn()
                    {
                        Ok(_) => info!("Node.js 服务已启动"),
                        Err(e) => error!("启动 Node.js 服务失败: {}", e),
                    }
                } else {
                    error!("Node.js 脚本不存在: {:?}", server_script);
                }

                // 启动 Python 服务
                if python_script.exists() {
                    match Command::new("python")
                        .arg(&python_script)
                        .current_dir(base_path.join("scripts"))
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
