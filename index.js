(function(){
    var requestAnimationFrame = (function(){
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback){
                window.setTimeout(callback, 1000 / 60);
        };
    })();

    var width, height, scale,
        canvas, context,
        particles,
        didInit;

    var dot;

    function Particle(x,y){
        this.x = ~~(x + Math.random()*32-16);
        this.y = ~~(y + Math.random()*32-16);
    }

    function update(){
        context.fillStyle = 'rgba(32,32,32,0.3)';
        context.fillRect(0, 0, width, height);

        context.fillStyle = '#FFFFFF';
        context.strokeStyle = '#FFFFFF';
        for (var i=0;i<particles.length;++i) {
            var p = particles[i];

            context.fillRect(p.x, p.y, 1, 1);

            // context.beginPath();
            // context.moveTo(p.x, p.y);
            // context.lineTo(p.x+1, p.y);
            // context.stroke();

            //context.putImageData(dot, p.x*scale, p.y*scale);
        }

        context.lineWidth=1;
        context.fillStyle="#CCCCCC";
        context.font="16px sans-serif";
        context.fillText(""+width+"x"+height+"@"+scale+"x", 10, 25);

        requestAnimationFrame(update);
    }

    function init(){
        canvas = document.getElementById("canvas") || document.createElement("canvas");
        canvas.id = 'canvas';
        document.body.appendChild(canvas);
        context = canvas.getContext("2d");
        context.imageSmoothingEnabled = context.mozImageSmoothingEnabled = context.webkitImageSmoothingEnabled = false;
        resizeCanvas();
        context.scale(scale, scale);

        particles = [];

        if(!didInit){
            didInit = true;

            dot = context.createImageData(1, 1);
            dot[0] = dot[1] = dot[2] = dot[3] = 255;

            update();
            bindEvents();
        }
    }

    function resizeCanvas(){
        var devicePixelRatio = window.devicePixelRatio || 1;

        var backingStoreRatio = context.webkitBackingStorePixelRatio ||
                                context.mozBackingStorePixelRatio ||
                                context.msBackingStorePixelRatio ||
                                context.oBackingStorePixelRatio ||
                                context.backingStorePixelRatio || 1;
        
        scale = devicePixelRatio / backingStoreRatio;

        var oldWidth = window.innerWidth;
        var oldHeight = window.innerHeight;

        canvas.width = width = oldWidth * scale;
        canvas.height = height = oldHeight * scale;

        canvas.style.width = oldWidth + 'px';
        canvas.style.height = oldHeight + 'px';
    }

    function mouseMove(e){
        particles.push(new Particle(e.x,e.y));
        if (particles.length > 50) {
            particles.shift();
        }
    }

    function bindEvents(){
        window.addEventListener('resize', init);
        window.addEventListener('mousemove', mouseMove);
        window.addEventListener('touchmove', function(e){
            e.preventDefault();
            var touch = e.changedTouches[0];
            mouseMove({'x':~~touch.clientX,'y':~~touch.clientY});
        });
    }

    init();
})();