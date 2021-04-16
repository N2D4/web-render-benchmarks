let app = undefined;
let conts = new Map();


function pixiInit(objects) {
    if (app) {
        app.destroy(true);
    }

    app = new PIXI.Application({
        width: 400,
        height: 400,
        autoDensity: true,
        resolution: window.devicePixelRatio,
    });
    document.getElementById('pxjs').appendChild(app.view);
    registerHandlers();

    conts = new Map();
    for (const obj of objects) {
        if (!conts.has(obj.cont)) {
            const co = new PIXI.Container();
            conts.set(obj.cont, co);
            app.stage.addChild(co);
        }
        const gfx = new PIXI.Graphics();
        switch (obj.shape) {
            case 'rect': {
                gfx.beginFill(0xFFFF00);
                gfx.lineStyle(1, 0xFF0000);
                gfx.drawRect(0, 0, obj.width, obj.height);
                gfx.endFill();
                break;
            }
            case 'trap': {
                gfx.beginFill(0x0000FF);
                gfx.lineStyle(1, 0xFF0000);
                gfx.moveTo(obj.slopiness / 2, 0);
                gfx.lineTo(obj.width - obj.slopiness / 2, 0);
                gfx.lineTo(obj.width + obj.slopiness / 2, obj.height);
                gfx.lineTo(-obj.slopiness / 2, obj.height);
                gfx.closePath();
                gfx.endFill();
                break;
            }
        }
        gfx.x = obj.x;
        gfx.y = obj.y;
        conts.get(obj.cont).addChild(gfx);
    }
}

function pixiShift(by) {
    const cs = [...conts.values()];
    const c = cs[Math.floor(Math.random() * cs.length)];
    c.x += 2 * Math.random() * by - by;
    c.y += 2 * Math.random() * by - by;
}



function registerHandlers() {
    let drag = false;
    let dragStart = undefined;
    let dragEnd = undefined;
    app.view.addEventListener('mousedown', function(event) {
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
            app.stage.x += dragEnd.x - dragStart.x;
            app.stage.y += dragEnd.y - dragStart.y;

            dragStart = dragEnd;
        }
    });

    window.addEventListener('mouseup', function(event) {
        drag = false;
    });

    app.view.addEventListener('wheel', function(event) {
        app.stage.scale.x *= 1 - event.deltaY / 1000;
        app.stage.scale.y *= 1 - event.deltaY / 1000;
        event.preventDefault();
    });
}
