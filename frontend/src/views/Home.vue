<template>
  <div class="home-page">
    <!-- 轮播图 -->
    <div class="hero-banner mb-5">
      <div class="hero-content">
        <h1>欢迎来到 ShoppingMonster</h1>
        <p>发现最新最热的商品</p>
        <router-link to="/products" class="btn btn-primary btn-lg">
          开始购物
        </router-link>
      </div>
    </div>

    <!-- 热销商品 -->
    <div class="container">
      <h2 class="mb-4">热销商品</h2>
      <div class="row">
        <div v-for="product in featuredProducts" :key="product.id" class="col-md-3 mb-4">
          <div class="card h-100 product-card">
            <div class="card-img-top bg-light" style="height: 200px; display: flex; align-items: center; justify-content: center;">
              <i class="fas fa-image fa-3x text-muted"></i>
            </div>
            <div class="card-body">
              <h5 class="card-title">{{ product.name }}</h5>
              <p class="card-text text-muted">{{ product.description }}</p>
              <h6 class="text-primary">¥{{ product.price.toFixed(2) }}</h6>
              <router-link :to="`/products/${product.id}`" class="btn btn-sm btn-outline-primary">
                查看详情
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { productAPI } from '@/api';

export default {
  name: 'Home',
  data() {
    return {
      featuredProducts: [],
      loading: false,
    };
  },
  mounted() {
    this.loadFeaturedProducts();
  },
  methods: {
    async loadFeaturedProducts() {
      try {
        this.loading = true;
        const response = await productAPI.list({ limit: 4 });
        this.featuredProducts = response.data;
      } catch (error) {
        console.error('加载热销商品失败:', error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.hero-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 100px 20px;
  text-align: center;
}

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 20px;
}

.hero-content p {
  font-size: 1.2rem;
  margin-bottom: 30px;
}

.product-card {
  transition: transform 0.3s, box-shadow 0.3s;
  border: none;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
</style>
