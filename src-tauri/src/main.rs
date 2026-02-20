#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use log::{error, info, warn};
use std::fs;
use std::path::PathBuf;
use std::process::{Command, Stdio};
use tauri::Manager;

fn find_base_path() -> PathBuf {
    // 方式1: exe 同级目录（MSI 安装的实际位置）- 优先！
    if let Ok(exe_path) = std::env::current_exe() {
        if let Some(exe_dir) = exe_path.parent() {
            let server_path = exe_dir.join("server").join("index.js");
            info!("检查 exe 同级目录: {:?}", exe_dir);
            if server_path.exists() {
                info!("✓ 在 exe 同级目录找到 server: {:?}", server_path);
                return exe_dir.to_path_buf();
            } else {
                info!("✗ exe 同级目录不存在 server/index.js");
            }

            // 也检查 server 目录是否存在
            let server_dir = exe_dir.join("server");
            if server_dir.exists() {
                info!("✓ server 目录存在: {:?}", server_dir);
                return exe_dir.to_path_buf();
            }
        }
    }

    // 方式2: 回退到当前目录
    let current_dir = std::env::current_dir().unwrap_or_else(|_| PathBuf::from("."));
    info!("回退到当前目录: {:?}", current_dir);
    current_dir
}

#[tauri::command]
fn start_backend_services() -> Result<String, String> {
    let base_path = find_base_path();
    let server_script = base_path.join("server").join("index.js");
    let python_script = base_path.join("scripts").join("enhanced_sanskrit_api.py");

    info!("========== 后端服务启动 ==========");
    info!("基础路径: {:?}", base_path);
    info!("Node.js 脚本: {:?}", server_script);
    info!("Python 脚本: {:?}", python_script);

    // 列出基础路径目录内容
    if base_path.exists() {
        info!("基础路径目录内容:");
        if let Ok(entries) = fs::read_dir(&base_path) {
            for entry in entries.flatten() {
                info!("  📁 {:?}", entry.file_name());
            }
        }

        // 检查 server 目录
        let server_dir = base_path.join("server");
        if server_dir.exists() {
            info!("✓ server 目录存在");
            if let Ok(entries) = fs::read_dir(&server_dir) {
                info!("server 目录内容 (前10个):");
                for entry in entries.flatten().take(10) {
                    info!("  📄 {:?}", entry.file_name());
                }
            }

            // 检查 node_modules
            let node_modules = server_dir.join("node_modules");
            if node_modules.exists() {
                info!("✓ node_modules 存在");
            } else {
                info!("✗ node_modules 不存在");
            }
        } else {
            info!("✗ server 目录不存在!");
        }
    } else {
        info!("✗ 基础路径不存在!");
    }

    // 检查 node 命令是否可用
    match Command::new("node").arg("--version").output() {
        Ok(output) => {
            if output.status.success() {
                let version = String::from_utf8_lossy(&output.stdout);
                info!("✓ Node.js 可用: {}", version.trim());
            } else {
                info!("✗ node --version 失败");
            }
        }
        Err(e) => {
            info!("✗ 找不到 node 命令: {}", e);
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
            Ok(child) => {
                info!("✓ Node.js 服务已启动 (PID: {})", child.id());
            }
            Err(e) => {
                error!("✗ 启动 Node.js 服务失败: {}", e);
            }
        }
    } else {
        error!("✗ Node.js 脚本不存在: {:?}", server_script);
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
            Ok(child) => {
                info!("✓ Python 服务已启动 (PID: {})", child.id());
            }
            Err(e) => {
                error!("✗ 启动 Python 服务失败: {}", e);
            }
        }
    } else {
        warn!("⚠ Python 脚本不存在，梵语 API 将不可用");
    }

    info!("========== 后端服务启动完成 ==========");

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

    info!("========== Lumina 应用启动 ==========");

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
        .setup(|_app| {
            info!("执行应用设置...");

            // 延迟启动后端服务
            std::thread::spawn(move || {
                std::thread::sleep(std::time::Duration::from_secs(3));

                info!("开始启动后端服务...");
                let _ = start_backend_services();
            });

            info!("应用设置完成");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
