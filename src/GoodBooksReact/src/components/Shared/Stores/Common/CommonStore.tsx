import {makeObservable, observable} from 'mobx';
import { apiClient } from "../../../../api/client";

export default class CommonStore {
    customers: string[] = [];
    paymentTerms: string[] = [];
    items: object[] = [];
    measurements: string[] = [];
    vendors: string[] = [];
    accounts: string[] = [];
    salesQuotationStatus: string[] = [];

    constructor() {
        this.loadCustomersLookup();
        this.loadPaymentTermsLookup();
        this.loadItemsLookup();
        this.loadMeasurementsLookup();
        this.loadVendorsLookup();
        this.loadAccountsLookup();
        this.loadQuotationStatusLookup();

        makeObservable(this, {
            customers: observable,
            paymentTerms: observable,
            items: observable,
            measurements: observable,
            vendors: observable,
            accounts: observable,
            salesQuotationStatus: observable,
        });
    }

    loadCustomersLookup() {
        const localCustomers: string[] = [];

        apiClient.get("common/customers")
            .then(result => {
                const data = result.data;
                for (let i = 0; i < Object.keys(data).length; i++) {
                    localCustomers.push(data[i]);
                }
                this.customers = localCustomers;
            });
    }

    loadPaymentTermsLookup() {
        const localPaymentTerms: string[] = [];
        apiClient.get("common/paymentterms")
            .then(result => {
                const data = result.data;
                for (let i = 0; i < Object.keys(data).length; i++) {
                    localPaymentTerms.push(data[i]);
                }
                this.paymentTerms = localPaymentTerms;
            });
    }
   
    loadVendorsLookup() {
        const localVendors: string[] = [];
        
        apiClient.get("common/vendors")
        .then(response => {
            const data = response.data;
            for (let i = 0; i < Object.keys(data).length; i++) {
                localVendors.push(data[i]);
            }
            this.vendors = localVendors;
        })
        .catch(error => {
          console.error(error);
        });   
    }

    loadItemsLookup() {
        const localItems: object[] = [];
        
        apiClient.get("common/items")
        .then(response => {
            const data = response.data;
            for (let i = 0; i < Object.keys(data).length; i++) {
                localItems.push(data[i]);
            }
            this.items = localItems;
        })
        .catch(error => {
          console.error(error);
        });   
    }

    loadMeasurementsLookup() {
        const localMeasurements: string[] = [];
        apiClient.get("common/measurements")
            .then(result => {
                const data = result.data;
                for (let i = 0; i < Object.keys(data).length; i++) {
                    localMeasurements.push(data[i]);
                }
                this.measurements = localMeasurements;
            });
    }

    loadQuotationStatusLookup() {
        const localQuotationStatus: string[] = [];
        apiClient.get("common/salesquotationstatus")
            .then(result => {
                const data = result.data;
                for (let i = 0; i < Object.keys(data).length; i++)
                {
                    localQuotationStatus.push(data[i]);
                }
                this.salesQuotationStatus = localQuotationStatus;
            })
    }

    loadAccountsLookup() {
        const localAccounts: string[] = []; 
        apiClient.get("common/postingaccounts")
            .then(result => {
                const data: string[] = result.data;
                for (let i = 0; i < Object.keys(data).length; i++) {
                    localAccounts.push(data[i]);
                }
                this.accounts = localAccounts;
            });
    }

    getApplicableTaxes(itemId: number, partyId: number) {
        const result = apiClient.get("tax/gettax?itemId=" + itemId + "&partyId=" + partyId);
        result.then(function (result) {
            return result.data;
        });
    }

    getSalesLineTaxAmount(quantity: number, amount: number, discount: number, taxes: Array<{ rate: number }>) {
        let lineTaxTotal = 0;
        amount = (amount * quantity) - discount;
        taxes.map(function (tax) {
            lineTaxTotal = lineTaxTotal + (amount - (amount / (1 + (tax.rate / 100))));
        });
        return lineTaxTotal;
    }

    getPurhcaseLineTaxAmount(quantity: number, amount: number, discount: number, taxes: Array<{ rate: number }>) {
        let lineTaxTotal = 0;
        amount = (amount * quantity) - discount;
        taxes.map(function (tax) {
            lineTaxTotal = lineTaxTotal + (amount - (amount / (1 + (tax.rate / 100))));
        });
        return lineTaxTotal;
    }
}