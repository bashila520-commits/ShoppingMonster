<template>
  <div class="checkout-page">
    <div class="row">
      <div class="col-md-8">
        <h2>确认订单</h2>

        <div class="card mb-4">
          <div class="card-header">收货地址</div>
          <div class="card-body">
            <form @submit.prevent="submitOrder">
              <div class="mb-3">
                <label class="form-label">收货地址</label>
                <textarea class="form-control" v-model="form.shippingAddress" required></textarea>
              </div>

              <h5 class="mt-4">订单商品</h5>
              <table class="table">
                <thead>
                  <tr>
                    <th>商品</th>
                    <th>单价</th>
                    <th>数量</th>
                    <th>小计</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in cart" :key="item.id">
                    <td>{{ item.name }}</td>
                    <td>¥{{ item.price }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>¥{{ (item.price * item.quantity).toFixed(2) }}</td>
                  </tr>
                </tbody>
              </table>

              <button type="submit" class="btn btn-primary mt-3" :disabled="loading">
                {{ loading ? '提交中...' : '提交订单' }}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">订单汇总</h5>
            <hr>
            <div class="d-flex justify-content-between mb-2">
              <span>小计:</span>
              <span>¥{{ cartTotal.toFixed(2) }}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span>运费:</span>
              <span>¥10.00</span>
            </div>
            <hr>
            <div class="d-flex justify-content-between h5">
              <span>总计:</span>
              <span>¥{{ (cartTotal + 10).toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { orderAPI } from '@/api';
import { mapGetters } from 'vuex';

export default {
  name: 'Checkout',
  data() {
    return {
      form: {
        shippingAddress: '',
      },
      cart: [],
      loading: false,
    };
  },
  computed: {
    ...mapGetters(['cartTotal']),
  },
  mounted() {
    this.cart = this.$store.state.cart;
    if (!this.cart.length) {
      this.$router.push('/cart');
    }
  },
  methods: {
    async submitOrder() {
      try {
        this.loading = true;
        const response = await orderAPI.create({
          shippingAddress: this.form.shippingAddress,
        });
        this.$router.push({
          name: 'Orders',
          params: { newOrderId: response.data.id },
        });
      } catch (error) {
        alert('订单提交失败: ' + error.message);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
