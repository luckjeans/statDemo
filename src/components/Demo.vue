<template>
  <div class="demo">
    <p><input v-model="suid"/><button @click="setSuid">设置suid</button></p>
    <p><input v-model="userType"/><button @click="setUserType">设置userType</button></p>
    <p><input v-model="clientId"/><button @click="setClientId">设置clientId</button></p>
    <p><button @click="submit">提交控件埋点</button></p>
  </div>
</template>
<script>
export default {
  name: 'Demo',
  data () {
    return {
      suid: '',
      userType: '',
      clientId: ''
    }
  },
  mounted () {
    this.ActivityStat.visitPage('Demo页')
  },
  methods: {
    setSuid () {
      this.ActivityStat.setSuid(this.suid)
    },
    setUserType () {
      this.ActivityStat.setUserType(this.suid)
    },
    setClientId () {
      this.ActivityStat.setClientId(this.userType)
    },
    submit () {
      this.ActivityStat.event('埋点demo', 'demo')
    }
  }
}
</script>
<style scoped>
.demo {
  margin-left: 40px;
}
p{
  float: left;
  width: 100%;
}
input {
  float: left;
}
button{
  float:left;
  margin-left: 40px;
}
</style>
