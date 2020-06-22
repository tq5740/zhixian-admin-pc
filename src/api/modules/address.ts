/*
 module:
    Address
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-15:  Address
 */
import ZxHttp from "../base";
interface AddressInfo {
  contact: string;
  tel: string;
  province: string;
  district: string;
  city: string;
  street: string;
  doorNumber?: string;
  lng: string;
  lat: string;
  orgId: string;
}
class Address extends ZxHttp {
  public myAddress(data: {
    data: {
      pageSize: number;
      pageNum: number;
      orgId: string;
      sortBy?: boolean;
      sortField?: string;
    };
  }) {
    return this.get("/address/address_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public createAddress(data: { data: AddressInfo }) {
    return this.post("/address/create_address_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public getLngLat(data: {
    data: {
      address: string;
    };
  }) {
    return this.get("/address/get_lng_lat", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public setDefault(data: {
    data: {
      addressId: string;
    };
  }) {
    return this.post("/address/set_default", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public deleteAddress(data: {
    data: {
      addressId: string;
    };
  }) {
    return this.post("/address/delete_address_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public updateAddress(data: { data: AddressInfo }) {
    return this.post("/address/update_address_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
}
export default new Address("work");
