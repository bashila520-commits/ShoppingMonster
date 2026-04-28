<template>
  <div class="orders-page">
    <h2 class="mb-4">我的订单</h2>

    <div v-if="orders.length === 0" class="alert alert-info">
      暂无订单，<router-link to="/products">去购物</router-link>
    </div>

    <div v-else class="table-responsive">
      <table class="table table-hover">
        <thead class="table-light">
          <tr>
            <th>订单号</th>
            <th>创建时间</th>
            <th>总金额</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ formatDate(order.createdAt) }}</td>
            <td>¥{{ order.totalAmount.toFixed(2) }}</td>
            <td>
              <span :class="['badge', getStatusClass(order.status)]">
                {{ getStatusText(order.status) }}
              </span>
            </td>
            <td>
              <button class="btn btn-sm btn-info" @click="viewOrder(order.id)">查看</button>
              <button v-if="order.status === 'pending'" class="btn btn-sm btn-warning ms-2" @click="payOrder(order.id)">支付</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { orderAPI } from '@/api';

export default {
  name: 'Orders',
  data() {
    return {
      orders: [],
      loading: false,
    };
  },
  mounted() {
    this.loadOrders();
  },
  methods: {
    async loadOrders() {
      try {
        this.loading = true;
        const response = await orderAPI.list();
        this.orders = response.data;
      } catch (error) {
        alert('加载订单失败: ' + error.message);
      } finally {
        this.loading = false;
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('zh-CN');
    },
    getStatusText(status) {
      const statusMap = {
        pending: '待支付',
        paid: '已支付',
        shipped: '已发货',
        delivered: '已收货',
        cancelled: '已取消',
      };
      return statusMap[status] || status;
    },
    getStatusClass(status) {
      const classMap = {
        pending: 'bg-warning',
        paid: 'bg-info',
        shipped: 'bg-primary',
        delivered: 'bg-success',
        cancelled: 'bg-danger',
      };
      return classMap[status] || 'bg-secondary';
    },
    viewOrder(orderId) {
      this.$router.push(`/orders/${orderId}`);
    },
    async payOrder(orderId) {
      this.$router.push(`/payment/${orderId}`);
    },
  },
};
</script>
