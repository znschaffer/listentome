
const clamp = (min, max) => value => Math.max(Math.min(value, max), min)
function dropHandler(ev) {
    console.log("File(s) Dropped");


    ev.preventDefault();

    if (ev.dataTransfer.items) {
        [...ev.dataTransfer.items].forEach((item, index) => {
            if (item.kind === "file") {
                const file = item.getAsFile();
                const encoder = new Mp3LameEncoder(44100, 96);

                file.arrayBuffer().then((buf) => {
                    let sizeNeeded = buf.byteLength % 4;
                    buf = buf.slice(0, buf.byteLength - sizeNeeded);
                    buf = new Float32Array(buf);

                    buf = buf.map(clamp(-1, 1));
                    encoder.encode([buf, buf]);
                    const blob = encoder.finish();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');

                    a.href = url;
                    a.download = file.name.substring(0, file.name.lastIndexOf(".")) + ".mp3";
                    a.click();
                })


            }
        })
    } else {
        [...ev.dataTransfer.files].forEach((file, i) => {
            console.log(`...file[${1}].name = ${file.name}`)
        })
    }
}

function dragOverHandler(ev) {
    console.log("File(s) in drop zone");

    ev.preventDefault();
}