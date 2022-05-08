import { createStore } from 'vuex'

export default createStore({
  state: {
    cart: {
        items: [],
    },
    isAuthenticated: false,
    token: '',
    isLoading: false,
    addToCartLoading: false,
    checkoutIsLoading: false,
  },
  mutations: {
    initializeStore(state) {
      if (localStorage.getItem('cart')) {
        state.cart = JSON.parse(localStorage.getItem('cart'))
      } else {
        localStorage.setItem('cart', JSON.stringify(state.cart))
      }

      if (localStorage.getItem('token')) {
          state.token = localStorage.getItem('token')
          state.isAuthenticated = true
      } else {
          state.token = ''
          state.isAuthenticated = false
      } 
    },
    addToCartLoading(state, status) {
      state.addToCartLoading = status
    },
    addToCart(state, item) {
      const exists = state.cart.items.filter(i => i.product.id === item.product.id)
      if (exists.length) {
        exists[0].quantity = parseInt(exists[0].quantity) + parseInt(item.quantity)
      } else {
        state.cart.items.push(item)
      }

      localStorage.setItem('cart', JSON.stringify(state.cart))
      state.addToCartLoading = true;
    },
    setIsLoading(state, status) {
      state.isLoading = status
    },
    setCheckoutIsLoading(state, status) {
      state.checkoutIsLoading = status
    },
    setToken(state, token) {
        state.token = token
        state.isAuthenticated = true
    },  
    removeToken(state) {
        state.token = ''
        state.isAuthenticated = false
    },
    clearCart(state) {
      state.cart = { items: [] }

      //console.log(state)
      //console.log(state.cart)
      
      localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    checkoutSuccess(){
      window.location.href = window.location.origin.concat('/cart/success');
      //window.location.href = '/cart/success/';
    }
  },
  actions: {
  },
  modules: {
  }
})