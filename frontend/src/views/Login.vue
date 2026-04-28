<template>
  <div class="login-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow">
            <div class="card-body p-5">
              <h3 class="text-center mb-4">登录</h3>

              <form @submit.prevent="login">
                <div class="mb-3">
                  <label class="form-label">邮箱</label>
                  <input type="email" class="form-control" v-model="form.email" required>
                </div>

                <div class="mb-3">
                  <label class="form-label">密码</label>
                  <input type="password" class="form-control" v-model="form.password" required>
                </div>

                <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                  {{ loading ? '登录中...' : '登录' }}
                </button>
              </form>

              <hr>

              <p class="text-center mb-0">
                还没有账户？<router-link to="/register">注册</router-link>
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
  name: 'Login',
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      loading: false,
    };
  },
  methods: {
    async login() {
      try {
        this.loading = true;
        const response = await authAPI.login(this.form);
        this.$store.commit('setUser', response.data);
        localStorage.setItem('token', response.data.token);
        this.$router.push('/products');
      } catch (error) {
        alert('登录失败: ' + error.message);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-page {
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
