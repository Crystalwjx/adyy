<template>
  <form class="loginForm">
    <section class="input_container appeal_container">
      <textarea v-model="info"
                :placeholder="text">
      </textarea>
      <div class="last-char"> {{info.length}}/200 </div>
    </section>
  </form>
</template>
<script>
export default {
  props: ['inputInfo', 'text'],
  // props: {
  //   inputInfo: {
  //     type: String,
  //     default: 'aaa'
  //   },
  //   text: {
  //     type: String,
  //     default: null
  //   }
  // },
  data () {
    return {
      info: ''
    }
  },
  watch: {
    inputInfo (val) {
      console.log(this.inputInfo)
      this.info = val
    },
    info (val) {
      this.$emit('update:inputInfo', val)
    }
  }
}
</script>
<style lang="scss" scoped>
.loginForm {
  background-color: transparent;
  margin-top: 0.576rem;
  margin-bottom: 0.17rem;
  .appeal_container {
    position: relative;
    border-bottom: 0;
    border-radius: 0.2rem;
    border: 1px solid #c1c1c1;
    padding: 0.3rem 0.384rem 1rem;
    textarea {
      width: 100%;
      height: 3.31rem;
      outline: none;
      font-size: 0.68rem;
      letter-spacing: 0.24px;
      overflow: auto;
    }
    textarea::-webkit-input-placeholder {
      color: #848484;
      font-size: 0.68rem;
    }
    .last-char {
      position: absolute;
      right: 0.5rem;
      bottom: 0.5rem;
      font-size: 0.68rem;
    }
  }
}
</style>