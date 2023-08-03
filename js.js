const clamp = (min, max) => value => Math.max(Math.min(value, max), min)


let sampleRate = 44100;
let bitDepth = 320;
let range = 0.8;

function handleBitDepth(ev) {

    bitDepth = Number.parseInt(ev.target.value);
    console.log(bitDepth)

}

function handleSampleRate(ev) {
    sampleRate = Number.parseInt(ev.target.value);
    console.log(sampleRate)
}
function handleRange(ev) {
    range = Number.parseFloat(ev.target.value);
    console.log(range)
}
function dropHandler(ev) {
    console.log("File(s) Dropped");


    ev.preventDefault();

    if (ev.dataTransfer.items) {
        [...ev.dataTransfer.items].forEach((item, index) => {
            if (item.kind === "file") {
                const file = item.getAsFile();
                const encoder = new Mp3LameEncoder(sampleRate, bitDepth);

                file.arrayBuffer().then((buf) => {
                    let sizeNeeded = buf.byteLength % 4;
                    buf = buf.slice(0, buf.byteLength - sizeNeeded);
                    buf = new Float32Array(buf);
                    buf = buf.map(clamp(-range, range));
                    for(let i=0; i < 44100 * buf.length; i+=8192) {
                        encoder.encode([buf.subarray(i, i+8192), buf.subarray(i, i+8192)])
                    }
                    const blob = encoder.finish();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');

                    a.href = url;
                    a.download = file.name.substring(0, file.name.lastIndexOf(".")) + ".mp3";
                    a.innerText = file.name;
                    document.getElementById("output").appendChild(a);
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
    ev.preventDefault();
}