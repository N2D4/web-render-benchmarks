let svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
document.getElementById('svg').appendChild(svg);
let sscale;
let stranslate;
let sobjects = [];


function svgInit(objs) {
    sscale = 1;
    stranslate = [0, 0];
    svg.setAttribute('width', "400");
    svg.setAttribute('height', "400");
    svg.style.backgroundColor = "black";
    svg.style.pointerEvents = 'all';
    sobjects = objs;
    svgDraw();
}

function svgDraw() {
    while (svg.lastChild) {
        svg.removeChild(svg.lastChild);
    }
    svg.setAttribute('viewBox', `${stranslate[0]} ${stranslate[1]} ${400*sscale} ${400*sscale}`);


    for (const obj of sobjects) {
        switch (obj.shape) {
            case 'rect': {
                const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                rect.setAttribute('x', obj.x);
                rect.setAttribute('y', obj.y);
                rect.setAttribute('width', obj.width);
                rect.setAttribute('height', obj.height);
                rect.style.fill = "yellow";
                rect.style.strokeWidth = "1";
                rect.style.stroke = "red";
                svg.appendChild(rect);
                break;
            }
            case 'trap': {
                const trap = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                trap.setAttribute('points', [
                    `${obj.x + obj.width - obj.slopiness / 2},${obj.y}`,
                    `${obj.x + obj.slopiness / 2},${obj.y}`,
                    `${obj.x - obj.slopiness / 2},${obj.y + obj.height}`,
                    `${obj.x + obj.width + obj.slopiness / 2},${obj.y + obj.height}`,
                ].join(' '));
                trap.style.fill = "blue";
                trap.style.strokeWidth = "1";
                trap.style.stroke = "red";
                svg.appendChild(trap);
                break;
            }
        }
    }
}

(() => {
    let drag = false;
    let dragStart = undefined;
    let dragEnd = undefined;
    svg.addEventListener('mousedown', function(event) {
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
            stranslate[0] -= (dragEnd.x - dragStart.x) * sscale;
            stranslate[1] -= (dragEnd.y - dragStart.y) * sscale;
            svg.setAttribute('viewBox', `${stranslate[0]} ${stranslate[1]} ${400*sscale} ${400*sscale}`);

            dragStart = dragEnd;
        }
    });

    window.addEventListener('mouseup', function(event) {
        drag = false;
    });

    svg.addEventListener('wheel', function(event) {
        sscale /= 1 - event.deltaY / 1000;
        svgDraw();
        event.preventDefault();
    });
})();
