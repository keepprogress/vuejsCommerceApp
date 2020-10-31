<template>
  <div>
    <div class="container">
      <div class="row my-5 justify-content-center">
        <table class="table mt-4">
          <thead>
            <tr>
              <td>購買時間</td>
              <td>Email</td>
              <td>購買款項</td>
              <td>應付金額</td>
              <td>是否付款</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, key) in orders" :key="key">
              <td>{{ item.create_at | datetransform_from_timestamp }}</td>
              <td><span v-text="item.user.email" v-if="item.user"></span></td>
              <td>
                <ul class="list-unstyled">
                  <li v-for="(product, i) in item.products" :key="i">
                    {{ product.product.title }} 數量：{{ product.qty }}  {{ product.product.unit }}
                  </li>
                </ul>
              <td class="text-right"> {{ item.total | currency }}</td>
              <td>
                <strong v-if="item.is_paid" class="text-success">已付款</strong>
                <span v-else class="text-muted">尚未起用</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orders: {},
      isNew: false,
      isLoading: false,
      pagination: {},
    }
  }, 
  methods: {
    getPagination(page = 1) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/orders?page=${page}`; //'https://vue-course-api.hexschool.io/api/申請的 API 路徑/products' //:api_path  ==> 專屬API名稱
      const vm = this;
      console.log(process.env.APIPATH, process.env.CUSTOMPATH);
      vm.isLoading = true;
      this.$http.get(api).then((response) => {
        console.log(response.data);
        console.log(response.data.orders[0].user.email);
        vm.isLoading = false;
        vm.orders = response.data.orders;
        vm.pagination = response.data.pagination;
      });

    }

  },
  created() {
    this.getPagination();
  },
}
</script>