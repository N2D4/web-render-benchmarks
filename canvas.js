let canvas = document.createElement('canvas');
document.getElementById('cnvs').appendChild(canvas);
let ctx;
const scale = window.devicePixelRatio;
let lscale;
let objects = [];

function canvasInit(objs) {
    lscale = 1;
    canvas.style.width = "400px";
    canvas.style.height = "400px";
    canvas.width = 400 * scale;
    canvas.height = 400 * scale;
    ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);
    objects = objs;
    draw();
}

function draw() {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();


    for (const obj of objects) {
        switch (obj.shape) {
            case 'rect': {
                ctx.fillStyle = "yellow";
                ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
                ctx.strokeStyle = "red";
                ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
                break;
            }
            case 'trap': {
                ctx.beginPath()
                ctx.moveTo(obj.x + obj.slopiness / 2, obj.y);
                ctx.lineTo(obj.x + obj.width - obj.slopiness / 2, obj.y);
                ctx.lineTo(obj.x + obj.width + obj.slopiness / 2, obj.y + obj.height);
                ctx.lineTo(obj.x - obj.slopiness / 2, obj.y + obj.height);
                ctx.closePath();
                ctx.fillStyle = "blue";
                ctx.fill();
                ctx.strokeStyle = "red";
                ctx.stroke();
                break;
            }
        }
    }
}

(() => {
    let drag = false;
    let dragStart = undefined;
    let dragEnd = undefined;
    canvas.addEventListener('mousedown', function(event) {
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
            ctx.translate((dragEnd.x - dragStart.x) / lscale, (dragEnd.y - dragStart.y) / lscale);
            draw();

            dragStart = dragEnd;
        }
    });

    window.addEventListener('mouseup', function(event) {
        drag = false;
    });

    canvas.addEventListener('wheel', function(event) {
        ctx.scale(1 - event.deltaY / 1000, 1 - event.deltaY / 1000);
        lscale *= 1 - event.deltaY / 1000;
        draw();
        event.preventDefault();
    });
})();
