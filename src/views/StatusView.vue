<template>
  <div class="status">
    <div class="container">
      <div class="row">
        <div class="col-md-6 text-center">
          <div class="card mt-4 p-4">
            Nomor Virtual Account
            <p>
              <b>{{ showPaymentResponse.VirtualAccountAssigned }}</b>
              <span class="text-success">salin</span>
            </p>
            <p>{{ showGetPayment.payment_name }}</p>
            <p>Kode Bank : {{ showGetPayment.payment_number }}</p>
            <p>
              Bayar Sebelum :
              <b>{{ showPaymentResponse.TransactionExpiryDate }}</b>
            </p>
          </div>
          <div class="card mt-4 p-4">
            Cara Pembayaran
            <hr />
            {{ showGetPayment.payment_name }}
            <hr />
          </div>
        </div>
        <div class="col-md-6">
          <div class="card mt-4 p-4 text-center">
            <div class="row text-center status-req">
              <button class="btn btn-primary">Pending</button>
              <button class="btn btn-default">Refresh</button>
            </div>
            <div class="">
              <p>Nama Merchant : PT. Taman Wisata Candi</p>
              <p>Nomor Booming : {{ showPaymentResponse.RefNo }}</p>
              <p>Nomor Pembayaran :{{ showPaymentResponse.Code }}</p>
            </div>
          </div>
          <div class="card mt-4">
            <nav class="navbar navbar-expand navbar-dark bg-success">
              <div class="container">Detail pesanan</div>
            </nav>
            <div class="p-4 d-flex justify-content-space-between">
              <div
                class="row col-md-12"
                v-for="(getOrder, indexOrder) in order"
                :key="indexOrder"
              >
                <table
                  class="table table-borderless"
                  v-for="(getSite, indexSite) in getOrder.site_data"
                  :key="indexSite"
                >
                  <tr
                    v-for="(getAdult, indexAdult) in getSite.adult"
                    :key="indexAdult"
                  >
                    <td class="col1">
                      {{ getAdult.trf_qty }} x {{ getAdult.trf_name }}
                    </td>
                    <td class="col2">
                      {{ getAdult.trf_currency }}.
                      {{ getAdult.trf_total_amount }}.000
                    </td>
                  </tr>
                  <tr
                    v-for="(getChild, indexChild) in getSite.child"
                    :key="indexChild"
                  >
                    <td class="col1">
                      {{ getChild.trf_qty }} x {{ getChild.trf_name }}
                    </td>
                    <td class="col2">
                      {{ getChild.trf_currency }}.
                      {{ getChild.trf_total_amount }}.000
                    </td>
                  </tr>
                  <tr>
                    <td><hr /></td>
                  </tr>
                  <tr>
                    <td class="col1">Total harga</td>
                    <td class="col2">{{ qurrencyTot }}.{{ total }}.000</td>
                  </tr>
                  <tr>
                    <td class="col1">voucher</td>
                    <td class="col2"></td>
                  </tr>
                  <tr>
                    <td><hr /></td>
                  </tr>
                  <tr>
                    <td class="col1">total tagihan</td>
                    <td class="col2">{{ qurrencyTot }}.{{ total }}.000</td>
                  </tr>
                </table>
              </div>
              <hr />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scope>
.status-req {
  margin: 0 auto;
}
</style>
<script>
import axios from "axios";
import { onMounted, ref } from "vue";

export default {
  name: "PaymentPage",
  setup() {
    let transactions = ref([]);
    let order = ref([]);
    let getSiteDataAdult = ref([]);
    let getSiteDataChild = ref([]);
    let getSiteData = ref([]);
    let qurrencyTot = ref("");
    let payment = ref([]);
    let paymentDetail = ref([]);
    let paymentSite = ref([]);
    let showGetPayment = ref([]);
    let showPaymentResponse = ref([]);
    let total = ref(0);
    function fetchDataPayment() {
      axios
        .get("https://private-d9d018-apib2ctwc.apiary-mock.com/api/payment/3", {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZ2VudF9pZCI6NzgsImF1dGhvcml6ZWQiOnRydWUsImVtYWlsIjoiYmltYUBzYWt0aS50dXIiLCJleHAiOjE2MjQwODg4NzMsInVzZXIiOiJzYWt0aSIsInVzZXJfaWQiOjg2MX0.LBf8MjC8QAlJsi-dD-rvVquIau72COMyN-W02SIhlM8",
          },
        })
        .then((result) => {
          transactions.value = result.data.data;
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
    function fetchDataListOrder() {
      axios
        .get("https://private-d9d018-apib2ctwc.apiary-mock.com/api/cart", {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZ2VudF9pZCI6NzgsImF1dGhvcml6ZWQiOnRydWUsImVtYWlsIjoiYmltYUBzYWt0aS50dXIiLCJleHAiOjE2MjQwODg4NzMsInVzZXIiOiJzYWt0aSIsInVzZXJfaWQiOjg2MX0.LBf8MjC8QAlJsi-dD-rvVquIau72COMyN-W02SIhlM8",
          },
        })
        .then((result) => {
          let total_amount;
          let getAdultMap;
          let getSites;
          let getChildMap;
          let getCur;
          order.value = result.data.data.visit;
          total_amount = result.data.data.total_amount;
          order.value.map((getOrder) => {
            getOrder.site_data.map((getSite) => {
              getSites = getSite;
              getSite.adult.map((getAdult) => {
                getAdultMap = getAdult;
                getCur = getAdult.trf_currency;
              });
              getSite.child.map((getChild) => {
                getChildMap = getChild;
              });
            });
          });
          getSiteDataAdult.value = getAdultMap;
          getSiteDataChild.value = getChildMap;
          getSiteData.value = getSites;
          qurrencyTot.value = getCur;
          total.value = total_amount;
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
    function getDataPayment() {
      console.log(JSON.parse(localStorage.getItem("getPayment")));
      console.log(JSON.parse(localStorage.getItem("paymentResponse")).data);
      let paymentResponse = JSON.parse(
        localStorage.getItem("paymentResponse")
      ).data;
      let getPayment = JSON.parse(localStorage.getItem("getPayment"));

      showPaymentResponse.value = paymentResponse;
      showGetPayment.value = getPayment;
    }

    onMounted(() => {
      fetchDataPayment();
      fetchDataListOrder();
      getDataPayment();
    });
    return {
      transactions,
      order,
      total,
      qurrencyTot,
      payment,
      paymentDetail,
      paymentSite,
      showGetPayment,
      showPaymentResponse,
    };
  },
};
</script>
