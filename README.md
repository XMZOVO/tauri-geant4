# Tauri-Geant4

> 高性能、安全、便携的核物理探测器模拟仿真平台

这是使用[Tauri](https://tauri.app/)框架开发的以[Geant4](https://geant4.web.cern.ch/)模拟为基础的无源效率刻度软件，使用[Vue3](https://vuejs.org/)+[Vite](https://cn.vitejs.dev/)搭建前端，[Rust](https://www.rust-lang.org/)编写后台算法，通过服务端的Geant4模拟计算进行无源效率刻度。

- :bulb:服务端仿真，Tauri实现跨平台编译部署
- :zap:Rust高性能线性代数计算库实现快速本地运算
- :package:交互式探测器模型展示，直观调节探测器结构
- :electric_plug:多种模拟API接口，实现自定义粒子源、探测器结构与材料
- :clubs:提供预设置探测器模版，灵活调节与保存模版
- :book:内置自定义核素数据库，便捷查询全能峰能量值计算效率
- :part_alternation_mark:模拟能谱展示、能谱展宽、查看拟合曲线
- :triangular_ruler:线性、多项式、二次式多种方法拟合刻度曲线可选
- :clipboard:计算结果、探测器模型参数保存，历史记录查看

