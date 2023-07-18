import { proxy } from 'valtio';

// Create the store object using proxy
export const store = proxy({
  orders: [],

  setOrders: (newOrders) => {
    store.orders = newOrders;
  },

  clearOrders: () => {
    store.orders = [];
  },
});