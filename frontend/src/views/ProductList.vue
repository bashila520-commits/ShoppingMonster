<template>
  <div class="product-list-page">
    <div class="container-fluid py-4">
      <h2 class="mb-4">商品列表</h2>

      <!-- 搜索和筛选 -->
      <div class="row mb-4">
        <div class="col-md-12">
          <div class="input-group">
            <input type="text" class="form-control" placeholder="搜索商品..." v-model="searchQuery" @keyup="search">
            <button class="btn btn-outline-secondary" type="button" @click="search">
              <i class="fas fa-search"></i> 搜索
            </button>
          </div>
        </div>
      </div>

      <!-- 商品网格 -->
      <div class="row">
        <div v-if="products.length === 0" class="col-12">
          <div class="alert alert-info">未找到相关商品</div>
        </div>

        <div v-for="product in products" :key="product.id" class="col-md-3 mb-4">
          <div class="card h-100 product-card">
            <div class="card-img-top bg-light" style="height: 250px; display: flex; align-items: center; justify-content: center;">
              <i class="fas fa-image fa-5x text-muted"></i>
            </div>
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">{{ product.name }}</h5>
              <p class="card-text text-muted flex-grow-1">{{ product.description }}</p>
              <p class="text-muted small">库存: {{ product.stock }}</p>
              <h6 class="text-primary mb-3">¥{{ product.price.toFixed(2) }}</h6>
              <div class="btn-group w-100">
                <router-link :to="`/products/${product.id}`" class="btn btn-sm btn-outline-primary">
                  详情
                </router-link>
                <button class="btn btn-sm btn-primary" @click="addToCart(product)" :disabled="product.stock === 0">
                  加购
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <nav v-if="totalPages > 1" class="mt-4">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="previousPage">上一页</button>
          </li>
          <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
            <button class="page-link" @click="currentPage = page">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="nextPage">下一页</button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import { productAPI } from '@/api';

export default {
  name: 'ProductList',
  data() {
    return {
      products: [],
      searchQuery: '',
      currentPage: 1,
      totalPages: 1,
      pageSize: 12,
      loading: false,
    };
  },
  mounted() {
    this.loadProducts();
  },
  methods: {
    async loadProducts() {
      try {
        this.loading = true;
        const response = await productAPI.list({
          page: this.currentPage,
          limit: this.pageSize,
          search: this.searchQuery,
        });
        this.products = response.data;
        this.totalPages = Math.ceil(response.total / this.pageSize);
      } catch (error) {
        alert('加载商品失败: ' + error.message);
      } finally {
        this.loading = false;
      }
    },
    search() {
      this.currentPage = 1;
      this.loadProducts();
    },
    addToCart(product) {
      if (!this.$store.state.user) {
        this.$router.push('/login');
        return;
      }

      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      };

      const cart = this.$store.state.cart || [];
      const existingItem = cart.find(item => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push(cartItem);
      }

      this.$store.commit('updateCart', cart);
      alert('已添加到购物车');
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
        this.loadProducts();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1;
        this.loadProducts();
      }
    },
  },
};
</script>

<style scoped>
.product-card {
  transition: transform 0.3s, box-shadow 0.3s;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}
</style>
