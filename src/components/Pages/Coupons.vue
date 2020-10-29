<template>
  <div>
    <div class="text-right mt-4">
      <button class="btn btn-primary" @click="openModal(true)">
        建立新的優惠券
      </button>
    </div>
    <div class="container">
      <div class="row justify-content-center my-5">
        <table class="table mt-4">
          <thead>
            <tr>
              <td>名稱</td>
              <td>折扣百分比</td>
              <td>到期日</td>
              <td>是否啟用</td>
              <td>編輯</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in coupons" :key="item.id">
              <td>{{ item.title }}</td>
              <td>{{ item.percent }}%</td>
              <td>{{ item.due_date | datetransform_from_timestamp }}</td>
              <td>
                  <span v-if="item.is_enabled ===1" class="text-success">啟用</span>
                  <span v-else>未啟用</span>
              </td>
              <td>
                <button class="btn btn-outline-primary btn-sm"
                @click="openModal(false, item)">編輯</button>
                <button type="button" class="btn btn-outline-danger btn-sm" @click="deleteCoupon(item.id)">
                    <i class="far fa-trash-alt"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- <nav aria-label="Page navigation example">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: !pagination.has_pre }">
              <a
                class="page-link"
                href="#"
                aria-label="Previous"
                @click.prevent="getProducts(pagination.current_page - 1)"
              >
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <li
              class="page-item"
              v-for="page in pagination.total_pages"
              :key="page"
              :class="{ active: pagination.current_page === page }"
            >
              <a
                class="page-link"
                href="#"
                @click.prevent="getProducts(page)"
                >{{ page }}</a
              >
            </li>
            <li class="page-item" :class="{ disabled: !pagination.has_next }">
              <a
                class="page-link"
                href="#"
                aria-label="Next"
                @click.prevent="getProducts(pagination.current_page + 1)"
              >
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav> -->
        <!-- Modal -->
        <div
          class="modal fade"
          id="couponModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header bg-dark text-white">
                <h5 class="modal-title" id="exampleModalLabel">
                  <span>編輯優惠券</span>
                </h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                  
                    <div class="form-group">
                      <label for="formTitle">標題</label>
                      <input
                        type="text"
                        class="form-control"
                        id="formTitle"
                        v-model="tempCoupon.title"
                        placeholder="請輸入標題"
                      />
                    </div>
                    <div class="form-group">
                      <label for="couponcode">優惠碼</label>
                      <input
                        type="text"
                        class="form-control"
                        id="couponcode"
                        v-model="tempCoupon.code"
                        placeholder="請輸優惠碼"
                      />
                    </div>
                    <div class="form-group">
                      <label for="expiredDate">到期日</label>
                      <input
                        type="date"
                        class="form-control"
                        id="expiredDate"
                        v-model="due_date"
                        placeholder=""
                      />
                    </div>
                    <div class="form-group">
                      <label for="discount">折扣百分比</label>
                      <input
                        type="number"
                        class="form-control"
                        id="discount"
                        v-model="tempCoupon.percent"
                        placeholder="請輸入折扣百分比"
                      />
                    </div>
                    <div class="form-group">
                        <div class="form-check">
                            <input
                            class="form-check-input"
                            type="checkbox"
                            v-model = "tempCoupon.is_enabled"
                            :true-value = "1"
                            :false-value = "0"
                            id="is_enabled"
                            >
                            <label class="form-check-label" for="is_enabled">
                                是否啟用
                            </label>
                        </div>
                    </div>
                
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-dismiss="modal"
                >
                  取消
                </button>
                <button type="button" class="btn btn-primary" @click.prevent="updateCoupon">確認</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  data() {
    return {
      coupons: [],
      pagination: {},
      coupon_code: "",
      coupon: [],
      tempCoupon: {
          title: '',
          is_enabled: false,
          code: '',
          due_date: 0,
          percent: 100,
      },
      isNew: false,
      due_date: new Date(),
      
    };
  },
  watch: {
      due_date() {
          const vm = this;
          const datetime = new Date(vm.due_date)
          const timestamp = Math.floor(new Date(datetime/ 1000));
          vm.tempCoupon.due_date = timestamp;
      },
  },
  methods: {
    getcoupons(page = 1) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupons?page=${page}`;
      const vm = this;
      vm.isLoading = true;
      this.$http.get(api).then((response) => {
        console.log(response.data);
        vm.isLoading = false;
        vm.coupons = response.data.coupons;
        vm.pagination = response.data.pagination;
      });
    },
    openModal(isNew, item) {
        const vm = this;
      if (isNew) {
        this.tempCoupon = {};
        this.isNew = true;
      } else {
        this.tempCoupon = Object.assign({}, item);
        this.isNew = false;
        const dateAndTime = new Date(vm.tempCoupon.due_date * 1000).toISOString().split('T');
        vm.due_date = '2020-11-25';
        console.log(dateAndTime[0])
      }
      $("#couponModal").modal("show");
    },
    updateCoupon() {
        let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon`
        let httpMethod = "post";
        const vm = this;
        if (!vm.isNew) {
            api =  `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`;
            httpMethod = "put";
        }
        console.log(process.env.APIPATH, process.env.CUSTOMPATH);
        this.$http[httpMethod](api, { data: vm.tempCoupon }).then((response) => {
            console.log(response.data);
            if(response.data.success) {
                $("#couponModal").modal("hide");
                vm.getcoupons();
            } else {
                $("#couponModal").modal("hide");
                vm.getcoupons();
                console.log("新增失敗");
            }
        });
    },
    deleteCoupon(id) {
        let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${id}`
        console.log(id)
        this.$http.delete(api).then(() =>{
            this.getcoupons();
            console.log("已成功刪除");
        })
       
    }
  },

  created() {
      this.getcoupons();
  },
};
</script>