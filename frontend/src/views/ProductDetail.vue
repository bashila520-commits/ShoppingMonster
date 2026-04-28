<template>
  <div class="product-detail-page">
    <div class="container py-5">
      <nav class="mb-4">
        <router-link to="/products">商品列表</router-link> / {{ product.name }}
      </nav>

      <div v-if="product.id" class="row">
        <!-- 商品图片 -->
        <div class="col-md-6">
          <div class="bg-light rounded" style="height: 400px; display: flex; align-items: center; justify-content: center;">
            <i class="fas fa-image fa-10x text-muted"></i>
          </div>
        </div>

        <!-- 商品信息 -->
        <div class="col-md-6">
          <h1>{{ product.name }}</h1>
          <p class="text-muted">{{ product.description }}</p>

          <div class="my-4">
            <h3 class="text-primary">¥{{ product.price.toFixed(2) }}</h3>
            <p>库存: <span :class="product.stock > 0 ? 'text-success' : 'text-danger'">
              {{ product.stock > 0 ? `${product.stock}件` : '缺货' }}
            </span></p>
          </div>

          <div class="card mb-4">
            <div class="card-body">
              <div class="mb-3">
                <label class="form-label">购买数量</label>
                <div class="input-group" style="width: 150px">
                  <button class="btn btn-outline-secondary" @click="quantity > 1 && quantity--">-</button>
                  <input type="text" class="form-control text-center" :value="quantity" readonly>
                  <button class="btn btn-outline-secondary" @click="quantity < product.stock && quantity++">+</button>
                </div>
              </div>

              <button class="btn btn-primary btn-lg w-100" @click="addToCart" :disabled="product.stock === 0">
                {{ product.stock === 0 ? '缺货' : '加入购物车' }}
              </button>

              <button class="btn btn-outline-secondary w-100 mt-2">
                <i class="fas fa-heart"></i> 收藏
              </button>
            </div>
          </div>

          <!-- 商品详情 -->
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">商品详情</h5>
              <ul>
                <li>分类: {{ product.category }}</li>
                <li>SKU: {{ product.sku }}</li>
                <li>上架时间: {{ formatDate(product.createdAt) }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="alert alert-info">
        加载中...
      </div>
    </div>
  </div>
</template>

<script>
import { productAPI } from '@/api';

export default {
  name: 'ProductDetail',
  data() {
    return {
      product: {},
      quantity: 1,
      loading: false,
    };
  },
  mounted() {
    this.loadProduct();
  },
  methods: {
    async loadProduct() {
      try {
        this.loading = true;
        const productId = this.$route.params.id;
        const response = await productAPI.getDetail(productId);
        this.product = response.data;
      } catch (error) {
        alert('加载商品失败: ' + error.message);
      } finally {
        this.loading = false;
      }
    },
    addToCart() {
      if (!this.$store.state.user) {
        this.$router.push('/login');
        return;
      }

      const cartItem = {
        id: this.product.id,
        name: this.product.name,
        price: this.product.price,
        quantity: this.quantity,
      };

      const cart = this.$store.state.cart || [];
      const existingItem = cart.find(item => item.id === this.product.id);

      if (existingItem) {
        existingItem.quantity += this.quantity;
      } else {
        cart.push(cartItem);
      }

      this.$store.commit('updateCart', cart);
      alert('已添加到购物车');
      this.$router.push('/cart');
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('zh-CN');
    },
  },
};
</script>
