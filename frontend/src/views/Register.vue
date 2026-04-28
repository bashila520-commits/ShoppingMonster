<template>
  <div class="register-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow">
            <div class="card-body p-5">
              <h3 class="text-center mb-4">注册账户</h3>

              <form @submit.prevent="register">
                <div class="mb-3">
                  <label class="form-label">用户名</label>
                  <input type="text" class="form-control" v-model="form.username" required>
                </div>

                <div class="mb-3">
                  <label class="form-label">邮箱</label>
                  <input type="email" class="form-control" v-model="form.email" required>
                </div>

                <div class="mb-3">
                  <label class="form-label">密码</label>
                  <input type="password" class="form-control" v-model="form.password" required>
                </div>

                <div class="mb-3">
                  <label class="form-label">确认密码</label>
                  <input type="password" class="form-control" v-model="form.confirmPassword" required>
                </div>

                <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                  {{ loading ? '注册中...' : '注册' }}
                </button>
              </form>

              <hr>

              <p class="text-center mb-0">
                已有账户？<router-link to="/login">登录</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authAPI } from '@/api';

export default {
  name: 'Register',
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      loading: false,
    };
  },
  methods: {
    async register() {
      if (this.form.password !== this.form.confirmPassword) {
        alert('两次输入的密码不一致');
        return;
      }

      try {
        this.loading = true;
        await authAPI.register({
          username: this.form.username,
          email: this.form.email,
          password: this.form.password,
        });
        alert('注册成功，请登录');
        this.$router.push('/login');
      } catch (error) {
        alert('注册失败: ' + error.message);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.register-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card {
  border: none;
  border-radius: 10px;
}
</style>
