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
    <p>{{ xpos }} -- {{ ypos }}</p>
    <p>{{ touchForce }} -- {{ azimuthAngle }}</p>
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
      last_xpos: 0,
      last_ypos: 0,

      pressure: 0,
      azimuthAngle: 0,
      touchForce: 0,
      event: null
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

    canvas.addEventListener(
      "touchmove",
      function(e) {
        e.preventDefault();

        componentSignature.touchForce =
          e.targetTouches[e.targetTouches.length - 1].force;
        componentSignature.azimuthAngle =
          e.targetTouches[e.targetTouches.length - 1].azimuthAngle;
        if (componentSignature.touchForce > 0.0005) {
          componentSignature.last_xpos = componentSignature.xpos;
          componentSignature.last_ypos = componentSignature.ypos;
          componentSignature.xpos =
            e.targetTouches[e.targetTouches.length - 1].pageX - this.offsetLeft;
          componentSignature.ypos =
            e.targetTouches[e.targetTouches.length - 1].pageY - this.offsetTop;
          ctx.beginPath();
          ctx.lineWidth = componentSignature.touchForce * 8;
          ctx.moveTo(
            componentSignature.last_xpos,
            componentSignature.last_ypos
          );
          ctx.lineTo(componentSignature.xpos, componentSignature.ypos);
          ctx.closePath();
          ctx.stroke();
        }
      },
      false
    );

    canvas.addEventListener(
      "touchstart",
      function(e) {
        e.preventDefault();
        componentSignature.touchForce =
          e.targetTouches[e.targetTouches.length - 1].force;
        componentSignature.azimuthAngle =
          e.targetTouches[e.targetTouches.length - 1].azimuthAngle;

        if (componentSignature.touchForce > 0.001) {
          componentSignature.xpos =
            e.targetTouches[e.targetTouches.length - 1].pageX - this.offsetLeft;
          componentSignature.ypos =
            e.targetTouches[e.targetTouches.length - 1].pageY - this.offsetTop;

          canvas.beginPath();
          canvas.arc(
            componentSignature.xpos,
            componentSignature.ypos,
            8 * componentSignature.touchForce,
            0,
            2 * Math.PI,
            true
          );
          canvas.stroke();
          componentSignature.last_xpos = componentSignature.xpos;
          componentSignature.last_ypos = componentSignature.ypos;
        }
      },
      false
    );

    /* Drawing on Paint App */
    ctx.lineWidth = 5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = rgb(0, 0, 255);
  },
  methods: {}
};
</script>

<style></style>
