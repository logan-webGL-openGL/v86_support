// to invoke emulator API and run in the browser.

"use strict";

$(function() {
    var emb_emulator = window.emulator = new V86Starter({
        //wasm_path: "build/v86.wasm",
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
            url: "images/embed_buildroot_test.iso",
        },
        filesystem: {
              basefs: "tools/fstest.json",
              baseurl: "/mnt/",
        },
        autostart: true,
    });

$(function()
    {
        $('#uploadfs').on('change',function ()
        {
           
                writefile($(this).get(0).files[0]);
                function writefile(file) {
                    var reader = new FileReader();
                    reader.readAsArrayBuffer(file);
                    reader.onload = function() {
                        var output = reader.result;
                        var buffer = new ArrayBuffer(output.length);
			buffer.set(output);
			 emb_emulator.create_file("/mnt/log.txt", buffer, function(error)
                    	 {
                         	if(error) throw error;           
                         });
                         emb_emulator.read_file("/mnt/debian/Readme.md", function(error, data)
                         {
                                if(error) throw error;
                                console.log(data);         
                         });
                  }
                  
               }
        });
    });
});
