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
        canvas, context, pointSize,
        didInit;

    var particles, x=0.1, y=0.1;

    function Particle(x,y){
        this.x = ~~(x + Math.random()*32-16);
        this.y = ~~(y + Math.random()*32-16);
    }

    // set up context so drawing area is bounded by given coordinates
    function viewport(minx,miny,maxx,maxy) {
        var w = maxx-minx;
        var h = maxy-miny;
        context.translate(width*0.5,height*0.5);
        context.scale(width/w, height/h);
        context.lineWidth = pointSize = 1.0/width;
    }

    function update(){
        context.save();

        viewport(-1.86,-1.51,+1.86,+1.51);

        var a = -0.966918,
            b = 2.879879,
            c = 0.765145,
            d = 0.744728;

        var xnew,ynew,h;
        for (var i=0; i<1000; ++i) {
            xnew = Math.sin(y*b) + c*Math.sin(x*b);
            ynew = Math.sin(x*a) + d*Math.sin(y*a);
            x = xnew;
            y = ynew;

            h = 200 + (((x*y)*100)%100);
            context.fillStyle = 'hsla(' + h + ',100%,66%,0.3)';
            context.fillRect(x, y, pointSize, pointSize);
        }

        context.restore();

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

        context.fillStyle = '#000000';
        context.fillRect(0, 0, width, height);

        particles = [];

        if(!didInit){
            didInit = true;
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
        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = width * scale;
        canvas.height = height * scale;

        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
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