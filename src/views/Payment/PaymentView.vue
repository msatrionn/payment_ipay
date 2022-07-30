<template>
  <p>Pilih Metode Pembayaran</p>
  <div class="row">
    <div class="col-md-6">
      <div
        class="card mt-2"
        v-for="(item, index) in transactions.category"
        :key="index"
      >
        <nav class="navbar navbar-expand navbar-dark bg-success">
          <div class="container">{{ item.category_name }}</div>
        </nav>
        <div class="container p-3">
          <div class="row">
            <div
              class="col-sm-3 mt-2"
              v-for="(itemChannel, indexChannel) in item.payment_channel"
              :key="indexChannel"
            >
              <div class="card" v-on:click="sendData(itemChannel)">
                <div class="card-body">
                  <img
                    v-bind:src="itemChannel.payment_image_url"
                    class="image-account"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <div class="card">
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
</template>
<style scope>
.image-account {
  width: 100%;
}
</style>
<script>
import axios from "axios";
import { onMounted, ref } from "vue";
import { sha256 } from "js-sha256";
export default {
  name: "PaymentPage",
  setup() {
    let transactions = ref([]);
    let order = ref([]);
    let getSiteDataAdult = ref([]);
    let getSiteDataChild = ref([]);
    let getSiteData = ref([]);
    let total = ref(0);
    let qurrencyTot = ref("");
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

    async function sendData(getPayment) {
      localStorage.setItem("getPayment", JSON.stringify(getPayment));
      const detailTransactions = [
        {
          Id: getSiteDataAdult.value.trf_id,
          Name: getSiteDataAdult.value.trf_name,
          Quantity: getSiteDataAdult.value.trf_qty,
          Amount: getSiteDataAdult.value.trf_total_amount,
          ParentType: "ITEM",
        },
        {
          Id: getSiteDataChild.value.trf_id,
          Name: getSiteDataChild.value.trf_name,
          Quantity: getSiteDataChild.value.trf_qty,
          Amount: getSiteDataChild.value.trf_total_amount,
          ParentType: "ITEM",
        },
        getSiteData.value.adult,
        getSiteData.value.child,
      ];
      let refNumber = Math.floor(
        new Date("2012.08.10").getTime() / 1000
      ).toString();
      let getPaymentId = getPayment.payment_id.toString();

      const getSignature = sha256(
        "ID00919" || refNumber || total.value.toString() || "IDR"
      );
      let sendBody = {
        APIVersion: "2.0",
        MerchantCode: "ID00919",
        PaymentId: getPaymentId,
        Currency: "IDR",
        RefNo: Math.floor(new Date("2012.08.10").getTime() / 1000),
        Amount: total.value,
        ProdDesc: "Pembayaran tiket TWC TWC.1659076554",
        RequestType: "Seamless",
        UserName: "Pretest AINO",
        UserEmail: "pretest@hotmail.red",
        UserContact: "081234567890",
        Remark: "Pembayaran tiket TWC TWC.1659076554",
        Lang: "iso-8859-1",
        ResponseURL:
          "https://sandbox.ipay88.co.id/epayment/fujipaystatusv2.asp",
        BackendURL:
          "http://sandbox.ipay88.co.id/ePayment/testing/RequestForm_savetemp.asp",
        Signature: getSignature,
        ItemTransactions: detailTransactions,
        ShippingAddress: {
          FirstName: "Techsupp",
          LastName: "Alpha",
          Address: "Jl. Test Blok R No.1",
          City: "Jakarta",
          State: "DKI Jakarta",
          PostalCode: "18800",
          Phone: "08123456789",
          CountryCode: "1",
        },
        BillingAddress: {
          FirstName: "Techsupp",
          LastName: "Alpha",
          Address: "Jl. Test Blok R No.1",
          City: "Jakarta",
          State: "DKI Jakarta",
          PostalCode: "18800",
          Phone: "08123456789",
          CountryCode: "1",
        },
        Sellers: [
          {
            Id: "SELLER123",
            Name: "Sellername",
            LegalId: "3274011001900001",
            SellerIdNumber: null,
            Email: "sellername@gmail.com",
            Url: "www.sunrise.com",
            address: {
              FirstName: "Seller",
              LastName: "Alpha",
              Address: "Jalan Tentara Pelajar no 49",
              City: "Jakarta Utara",
              State: "DKI Jakarta",
              PostalCode: "12960",
              Phone: "08123456789",
              CountryCode: "IDN",
            },
          },
          {
            Id: "SELLER456",
            Name: "Sellername B",
            LegalId: "3173021507910004",
            SellerIdNumber: null,
            Email: "sellernameb@gmail.com",
            Url: "www.tokobagus.com",
            address: {
              FirstName: "Seller",
              LastName: "Beta",
              Address: "Jalan Krici raya IX",
              City: "Jakarta Selatan",
              State: "DKI Jakarta",
              PostalCode: "12960",
              Phone: "08123456789",
              CountryCode: "IDN",
            },
          },
        ],
        SettingField: [
          {
            Name: "TenorInstallment",
            Value: "3",
          },
        ],
      };

      const headers = new Headers();
      headers.append("Authorization", "api_key");
      const request = await axios
        .post(
          "https://private-d9d018-apib2ctwc.apiary-mock.com/ePayment/WebService/PaymentAPI/Checkout",
          sendBody
        )
        .then((result) => {
          localStorage.setItem("paymentResponse", JSON.stringify(result));
          console.log(
            "result",
            JSON.parse(localStorage.getItem("paymentResponse"))
          );
          location.href = "/status";
        })
        .catch((err) => {});
    }

    onMounted(() => {
      fetchDataPayment();
      fetchDataListOrder();
    });
    return {
      transactions,
      order,
      total,
      qurrencyTot,
      sendData,
    };
  },
};
</script>
