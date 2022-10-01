# Tauri-Geant4

> High-performance, safe and portable nuclear physics detector simulation platform.

This is a passive efficiency calibration software based on [Geant4](https://geant4.web.cern.ch/) simulation developed using [Tauri](https://tauri.app/) framework. It uses [Vue3](https://cn.vitejs.dev/) to build the front-end, [Rust](https://www.rust-lang.org/) writes the back-end algorithm, and performs passive efficiency calibration through Geant4 simulation calculation on the server.

- :bulb:Server-side simulation, Tauri realizes cross-platform compilation and deployment.
- :zap:Rust high-performance linear algebra computing library for fast local operations.
- :package:Interactive detector model display, intuitive adjustment of detector structure.
- :electric_plug:Multiple analog API interfaces to implement custom particle source, detector structure and material.
- :clubs:Provide preset detector templates, flexibly adjust and save templates.
- :book:Built-in custom nuclide database, easy to query the calculation efficiency of the omnipotent peak energy value.
- :part_alternation_mark:Simulate energy spectrum display, energy spectrum expansion, view fitting curve.
- :triangular_ruler:Linear, polynomial, quadratic methods to fit scale curve optional.
- :clipboard:Save calculation results, detector model parameters, and view historical records

