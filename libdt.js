"use strict";

function fun()
{
    var emulator = window.emulator = new V86Starter({
        wasm_path: "../build/v86.wasm",
        memory_size: 1024 * 1024 * 1024,
        vga_memory_size: 512 * 1024 * 1024,
        screen_container: document.getElementById("screen_container"),
        bios: {
            url: "../bios/seabios.bin",
        },
        vga_bios: {
            url: "../bios/vgabios.bin",
        },
        cdrom: {
            url: "../images/embedded.iso",
        },
        autostart: true,
    });
}






