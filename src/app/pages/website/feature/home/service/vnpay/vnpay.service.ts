import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as qs from 'qs';
import moment from 'moment-timezone';
import * as forge from 'node-forge';

function sortObject(obj: any) {
  return Object.entries(obj)
    .sort(([key1], [key2]) => key1.toString().localeCompare(key2.toString()))
    .reduce((result, item: any) => {
      result = {
        ...result,
        [item[0]]: encodeURIComponent(item[1].toString().replace(/ /g, '+')),
      };

      return result;
    }, {});
}

@Injectable({
  providedIn: 'root',
})
export class VnpayService {
  constructor(private http: HttpClient) {}

  generatePaymentUrl(orderInfo: any): string {
    const vnpTmnCode = '1VYBIYQP'; // VNPay Merchant Code
    const vnpHashSecret = 'NOH6MBGNLQL9O9OMMFMZ2AX8NIEP50W1'; // VNPay Hash Secret
    const vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'; // VNPay URL
    const vnpReturnUrl = 'http://localhost:4200/checkout'; // Return URL

    // Lấy thời gian tạo và hết hạn với múi giờ VN
    const vnpCreateDate = moment.tz('Asia/Ho_Chi_Minh').format('YYYYMMDDHHmmss');
    const vnpExpireDate = moment.tz('Asia/Ho_Chi_Minh').add(15, 'minutes').format('YYYYMMDDHHmmss');
    const orderId = moment().format('DDHHmmss'); // ID đơn hàng

    const vnpParams = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: vnpTmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,

      vnp_Amount: orderInfo.amount * 100,
      vnp_OrderInfo: `ThanhtoanchomaGD:${orderId}`,
      vnp_OrderType: 'other',
      vnp_ReturnUrl: vnpReturnUrl,
      vnp_IpAddr: '127.0.0.1',
      vnp_BankCode: 'VNBANK',
      vnp_CreateDate: vnpCreateDate,
      vnp_ExpireDate: vnpExpireDate,
    };

    // Sắp xếp các tham số
    const sortedVnpParams = sortObject(vnpParams);

    // Tạo chuỗi truy vấn
    const vnpParamsString = qs.stringify(sortedVnpParams, { encode: false });

    // Sinh HMAC-SHA512 hash
    const hmac = forge.hmac.create();
    hmac.start('sha512', vnpHashSecret);
    hmac.update(vnpParamsString);
    const hashValue = hmac.digest().toHex();

    // Tạo URL thanh toán cuối cùng
    const paymentUrl = `${vnpUrl}?${vnpParamsString}&vnp_SecureHash=${hashValue}`;
    return paymentUrl;
  }
}
