<template>
  <div class="addpoint animated zoomIn">积分：+{{point}}</div>
</template>
<script>
export default {
  props: ['point']
}
</script>
<style lang="scss" scoped>
.addpoint {
  width: 8rem;
  height: 2rem;
  border-radius: 2rem;
  background: #f0f9eb;
  color: #67c23a;
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: -1rem;
  margin-left: -4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  font-size: 1rem;
  font-family: "黑体";
}
@keyframes zoomIn {
  from {
    opacity: 0;
    -webkit-transform: scale3d(0.3, 0.3, 0.3);
    transform: scale3d(0.3, 0.3, 0.3);
  }

  50% {
    opacity: 1;
  }
}

.zoomIn {
  -webkit-animation-name: zoomIn;
  animation-name: zoomIn;
}

@media (print), (prefers-reduced-motion: reduce) {
  .animated {
    -webkit-animation-duration: 1ms !important;
    animation-duration: 1ms !important;
    -webkit-transition-duration: 1ms !important;
    transition-duration: 1ms !important;
    -webkit-animation-iteration-count: 1 !important;
    animation-iteration-count: 1 !important;
  }
}
</style>