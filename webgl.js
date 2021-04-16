let wcnvs = document.createElement('canvas');
document.getElementById('wbgl').appendChild(wcnvs);
let gl;
let wscale;
let xt;
let yt;
let wobjects = [];

function webglInit(objs) {
    wscale = 1;
    xt = 0;
    yt = 0;
    wcnvs.style.width = "400px";
    wcnvs.style.height = "400px";
    wcnvs.width = 400 * wscale;
    wcnvs.height = 400 * wscale;
    gl = wcnvs.getContext("webgl");
    if (!gl) {
      alert("WebGL is unavailable!");
      return;
    }
    wobjects = objs;
    webglDraw();
}

function webglDraw() {
    if (!gl) return;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);



    for (const obj of wobjects) {
        switch (obj.shape) {
            case 'rect': {
                gl.enable(gl.SCISSOR_TEST);
                gl.scissor(-xt + obj.x * wscale, -yt + obj.y * wscale, obj.width * wscale, obj.height * wscale);

                gl.clearColor(1.0, 1.0, 0.0, 1.0);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.disable(gl.SCISSOR_TEST);
                break;
            }
            case 'trap': {
                gl.enable(gl.SCISSOR_TEST);
                gl.scissor(-xt + obj.x * wscale, -yt + obj.y * wscale, obj.width * wscale, obj.height * wscale);

                gl.clearColor(0.0, 0.0, 1.0, 1.0);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.disable(gl.SCISSOR_TEST);
                break;
            }
        }
    }
}

(() => {
    let drag = false;
    let dragStart = undefined;
    let dragEnd = undefined;
    wcnvs.addEventListener('mousedown', function(event) {
        dragStart = {
            x: event.pageX,
            y: event.pageY,
        };

        drag = true;

    });

    window.addEventListener('mousemove', function(event) {
        if (drag) {
            dragEnd = {
                x: event.pageX,
                y: event.pageY,
            };
            xt -= dragEnd.x - dragStart.x;
            yt += dragEnd.y - dragStart.y;
            webglDraw();

            dragStart = dragEnd;
        }
    });

    window.addEventListener('mouseup', function(event) {
        drag = false;
    });

    wcnvs.addEventListener('wheel', function(event) {
        wscale *= 1 - event.deltaY / 1000;
        webglDraw();
        event.preventDefault();
    });
})();
