<template>
  <div style="padding: 20px;">
    <p>Firma qui</p>
    <div ref="canvasContainer">
      <canvas
        ref="signatureCanvas"
        width="500"
        height="200"
        style="border:1px solid #000000;"
      ></canvas>
    </div>
    <p>{{ xpos }} -- {{ ypos }} -- {{ pressure }} -- {{ touchForce }}</p>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Store } from "../store";

export default {
  name: "Signature",
  data() {
    return {
      xpos: 0,
      ypos: 0,
      pressure: 0,
      touchForce: 0
    };
  },
  mounted() {
    const componentSignature = this;
    var canvas = this.$refs.signatureCanvas;
    var ctx = canvas.getContext("2d");
    var sketch = this.$refs.canvasContainer;
    var sketch_style = getComputedStyle(sketch);
    canvas.width = parseInt(sketch_style.getPropertyValue("width"));
    canvas.height = parseInt(sketch_style.getPropertyValue("height"));
    var onPaint = function() {
      ctx.beginPath();
      ctx.moveTo(last_mouse.x, last_mouse.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.closePath();
      ctx.stroke();
    };
    var mouse = { x: 0, y: 0 };
    var last_mouse = { x: 0, y: 0 };

    /* Mouse Capturing Work */
    canvas.addEventListener(
      "mousemove",
      function(e) {
        last_mouse.x = mouse.x;
        last_mouse.y = mouse.y;

        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;

        componentSignature.xpos = mouse.x;
        componentSignature.ypos = mouse.y;
      },
      false
    );

    canvas.addEventListener(
      "touchmove",
      function(e) {
        // Iterate through the list of touch points and log each touch
        // point's force.
        for (var i = 0; i < e.targetTouches.length; i++) {
          componentSignature.touchForce+=e.targetTouches[i].force
        }
        componentSignature.touchForce=componentSignature.touchForce/e.targetTouches.length;
      },
      false
    );

    
    canvas.addEventListener(
      "pointerdown",
      function(e) {
        componentSignature.pressure = e.pressure;
      },
      false
    );

    /* Drawing on Paint App */
    ctx.lineWidth = 5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = "blue";

    canvas.addEventListener(
      "mousedown",
      function(e) {
        canvas.addEventListener("mousemove", onPaint, false);
      },
      false
    );

    canvas.addEventListener(
      "mouseup",
      function() {
        canvas.removeEventListener("mousemove", onPaint, false);
      },
      false
    );
  },
  methods: {}
};
</script>

<style></style>
