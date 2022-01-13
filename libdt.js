"use strict";

// import { Workbox } from 'https://storage.googleapis.com/workbox-cdn/releases/4.0.0/workbox-window.prod.mjs';

// to invoke emulator API //

$(function () {
    var embeddedEmulator = window.emulator = new V86Starter({
        wasm_path: "build/v86.wasm",
        memory_size: 64 * 1024 * 1024,
        vga_memory_size: 2 * 1024 * 1024,
        screen_container: document.getElementById("emb_container"),
        bios: {
            url: "bios/seabios.bin",
        },
        vga_bios: {
            url: "bios/vgabios.bin",
        },
        cdrom: {
            url: "build/embedded.iso",
        },
        filesystem: {
            //basefs: "tools/fstest.json",
            //baseurl: "/mnt/",
        },
        autostart: true,
        //disable_keyboard: true,
    });

    // File upload //
    $(function () {
        $('#uploadfs').on('change', function () {
            for (var i = 0; i < $(this).get(0).files.length; i++) {
                var fileName = $(this).get(0).files[i].name;
                writeFile($(this).get(0).files[i], fileName);
            }
            function writeFile(inputFile, fileName) {
                var reader = new FileReader();
                reader.readAsBinaryString(inputFile);
                reader.onload = function () {
                    var output = reader.result;
                    var buffer = new Uint8Array(output.length);
                    buffer.set(output.split("").map(function (chr) { return chr.charCodeAt(0); }));
                    embeddedEmulator.create_file(fileName, buffer, function (error) {
                        if (error) throw error;
                    });
                }
            }

        });
    });

    // File download //
    $(function () {
        $('#downloadfs').on('keypress', function (e) {
            var inputFile = this.value;

            if (e.which == 13) {
                embeddedEmulator.read_file(inputFile, function (error, uint8array) {
                    if (error) throw error;
                    if (uint8array) {
                        var fileName = inputFile.replace(/\/$/, "").split("/");
                        fileName = fileName[fileName.length - 1];
                        downloadFile(fileName, String.fromCharCode.apply(this, uint8array))
                    }
                });
            }
            function downloadFile(fileName, content) {
                var a = document.createElement("a");
                a.download = fileName;
                a.href = window.URL.createObjectURL(new Blob([content]));
                a.dataset.downloadurl = "application/octet-stream:" + a.download + ":" + a.href;
                a.click();
            }
        });
    });

    var lastTick = 0;
    var uptime = 0;
    var lastInstrCount = 0;
    var totalInstructions = 0;

    embeddedEmulator.add_listener("emulator-started", function () {
        var start = Date.now();
        console.log('instruction counter' + this.v86.cpu.instruction_counter[0]);
        var instructionCount = embeddedEmulator.get_instruction_counter();
        //console.log('instru conu ' + instructionCount);
        if (instructionCount < lastInstrCount) {
            // 32-bit wrap-around
            lastInstrCount -= 0x100000000;
        }

        var last_ips = instructionCount - lastInstrCount;
        lastInstrCount = instructionCount;
        totalInstructions += last_ips;

        var delta_time = start - lastTick;
        //console.log('delta' + delta_time);
        uptime += delta_time;
        //console.log('up' + uptime);
        lastTick = start;

        setInterval(function () {
            document.querySelector('#uptime').textContent = format_timestamp((Date.now() - start) / 1000 | 0);
        }, 999);
        setInterval(function () {
            document.querySelector('#speed').textContent = (last_ips / 1000 / delta_time).toFixed(1);
        }, 999);
        setInterval(function () {
            document.querySelector('#avg_speed').textContent = (totalInstructions / 1000 / uptime).toFixed(1);
        }, 999);
    });


    function format_timestamp(time) {
        if(time < 60)
              {
                  return time + "s";
              }
              else if(time < 3600)
              {
                  return (time / 60 | 0) + "m " + (time % 60) + "s";
              }
              else
              {
                  return (time / 3600 | 0) + "h " +
                      ((time / 60 | 0) % 60) + "m " +
                      (time % 60) + "s";
              }
          }

//}

// nohost browser Filesystem //

 // if ('serviceWorker' in navigator) {
   //  const wb = new Workbox('../build/nohost-sw.js?debug');

     // Wait on the server to be fully ready to handle routing requests
     //wb.controlling.then(serverReady);



     //wb.register();
   //}
    
});










