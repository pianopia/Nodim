var sys;

(function($){

  var Renderer = function(canvas){
    var canvas = $(canvas).get(0)
    // const dpr = window.devicePixelRatio || 1;
    // canvas.width = canvas.width * dpr;
    // canvas.height = canvas.height * dpr;
    var ctx = canvas.getContext("2d");
    var gfx = arbor.Graphics(canvas);
    var particleSystem;
    var bgcolor = "rgb(255, 255, 255)";
    var handler = null;

    var that = {
      init:function(system){
        particleSystem = system;
        particleSystem.screenSize(canvas.width, canvas.height);
        particleSystem.screenPadding(80);
        that.initMouseHandling();
      },
      redraw:function(){
        ctx.fillStyle = bgcolor;
        ctx.fillRect(0,0, canvas.width, canvas.height);
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for(var i = 0; i < (imageData.width*imageData.height); i++) {
            if((imageData.data[i*4] == 255) &&
               (imageData.data[i*4+1] == 255) &&
               (imageData.data[i*4+2] == 255)) {
                imageData.data[i*4+3] = 0;
            }
        }
        ctx.putImageData(imageData, 0, 0);

        particleSystem.eachEdge(function(edge, pt1, pt2){
          ctx.strokeStyle = "rgba(100,100,100, 1)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(pt1.x, pt1.y);
          ctx.lineTo(pt2.x, pt2.y);
          ctx.stroke();
        })

        var nodeBoxes = {}
        particleSystem.eachNode(function(node, pt){
          var label = node.name||""
          var w = ctx.measureText(""+label).width + 20
          if (!(""+label).match(/^[ \t]*$/)){
            pt.x = Math.floor(pt.x)
            pt.y = Math.floor(pt.y)
          }else{
            label = null
          }

          //ctx.fillStyle="red"; 
          //ctx.beginPath();
          //ctx.arc(200, 100, 40, 0, Math.PI*2, false);
          //ctx.fill();

          if (node.data.who == "sokusitsu")
          { // ノードの色
            //ctx.fillStyle = "rgba(100,100,100,1)"
            ctx.fillStyle = "#4682b4"
            //gfx.oval(pt.x-w/2, pt.y-w/2, w,w, {fill:ctx.fillStyle})
            gfx.rect(pt.x-w/2, pt.y-15, w, 30, {fill:ctx.fillStyle})
          }
          nodeBoxes[node.name] = [pt.x-w/2, pt.y-11, w, 22]

          // draw the text
          if (label){
            ctx.font = "12px Helvetica"
            ctx.textAlign = "center"
            ctx.fillStyle = "white"
            //if (node.data.color=='none') ctx.fillStyle = '#cccccc'
            ctx.fillText(label||"", pt.x, pt.y+4)
            ctx.fillText(label||"", pt.x, pt.y+4)
          }
        })
      },

      initMouseHandling:function(){
        var dragged = null;
        //_mouseP = arbor.Point(0, 0);
        handler = {
          clicked:function(e){
            console.log("arbor:clicked!");
            var pos = $(canvas).offset();
            _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top);
            dragged = particleSystem.nearest(_mouseP);
            if (dragged && dragged.node !== null){
              dragged.node.fixed = true
            }
            $(canvas).bind('mousemove', handler.dragged)
            $(window).bind('mouseup', handler.dropped)
            return false
          },
          dragged:function(e){
            console.log("arbor:dragged!");
            var pos = $(canvas).offset();
            var s = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)
            if (dragged && dragged.node !== null){
              var p = particleSystem.fromScreen(s)
              dragged.node.p = p
            }
            return false
          },

          dropped:function(e){
            console.log("arbor:dropped!");
            if (dragged===null || dragged.node===undefined) return
            if (dragged.node !== null) dragged.node.fixed = false
            dragged.node.tempMass = 1000
            dragged = null
            $(canvas).unbind('mousemove', handler.dragged)
            $(window).unbind('mouseup', handler.dropped)
            _mouseP = null
            return false
          }
        }
        handler.clicked;
        handler.dropped;
        $(canvas).mousedown(handler.clicked);
      },
    }
    return that
  }

  $(document).ready(function(){
    sys = arbor.ParticleSystem(2000, 100, 0.5, false, 60, 0.02);
    sys.parameters({gravity:true});
    sys.renderer = Renderer("#viewport");
  })

})(this.jQuery)
