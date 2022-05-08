<template>
    <div class="page-checkout">
        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Checkout</h1>
            </div>

            <div class="column is-12 box">
                <table class="table is-fullwidth">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr
                            v-for="item in cart.items"
                            v-bind:key="item.product.id"
                        >
                            <td>{{ item.product.name }}</td>
                            <td>${{ item.product.price }}</td>
                            <td>{{ item.quantity }}</td>
                            <td>${{ getItemTotal(item).toFixed(2) }}</td>
                        </tr>
                    </tbody>

                    <tfoot>
                        <tr>
                            <td colspan="2">Total</td>
                            <td>{{ cartTotalLength }}</td>
                            <td>${{ cartTotalPrice.toFixed(2) }}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div class="column is-12 box checkout_form_wrap">
                <h2 class="subtitle">Shipping details</h2>

                <p class="has-text-grey mb-4">* All fields are required</p>

                <div class="columns is-multiline">
                    <div class="column is-6">
                        <div class="field">
                            <label>First name*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="first_name">
                            </div>
                        </div>

                        <div class="field">
                            <label>Last name*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="last_name">
                            </div>
                        </div>

                        <div class="field">
                            <label>E-mail*</label>
                            <div class="control">
                                <input type="email" class="input" v-model="email">
                            </div>
                        </div>

                        <div class="field">
                            <label>Phone*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="phone">
                            </div>
                        </div>
                    </div>

                    <div class="column is-6">
                        <div class="field">
                            <label>Address*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="address">
                            </div>
                        </div>

                        <div class="field">
                            <label>Zip code*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="zipcode">
                            </div>
                        </div>

                        <div class="field">
                            <label>Place*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="place">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="notification is-danger mt-4" v-if="errors.length">
                    <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
                </div>

                <div>
                    <div>Select Payment Method:</div>
                    <div class="mt-1 is-flex is-flex-direction-column-reverse">
                        <label class="pt-2 is-clickable">Paypal
                            <input
                            type="radio"
                            name="radio"
                            :value="'paypal'"
                            v-model="websiteAccept"
                            />
                        </label>
                        <label class="pt-2 is-clickable">Stripe
                            <input
                            type="radio"
                            name="radio"
                            :value="'stripe'"
                            v-model="websiteAccept"
                            />
                        </label>
                        <!-- <p>{{ websiteAccept }}</p> -->
                    </div>
                </div>



                <hr>

                <div v-show="websiteAccept == 'stripe' ">
                    <div id="card-element" class="mb-5" ></div>

                    <template v-if="cartTotalLength">
                        <hr>
                        <button class="button is-dark" @click="submitForm">Pay with Stripe</button>
                    </template>
                </div>

                
                <div v-show="websiteAccept == 'paypal' " id="paypal-button-container" class="mt-4"></div>
               


                <div class="is-loading-bar has-text-centered checkout_loading_wrap" v-bind:class="{'is-loading': $store.state.checkoutIsLoading }">
                    <div class="lds-dual-ring"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'Checkout',
    data() {
        return {
            websiteAccept: null,
            cart: {
                items: []
            },
            stripe: {},
            card: {},
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            address: '',
            zipcode: '',
            place: '',
            gateway: '',
            errors: []
        }
    },
    mounted() {
        //this.$store.commit('setCheckoutIsLoading', true)
        document.title = 'Checkout | Djackets'
        this.cart = this.$store.state.cart
        if (this.cartTotalLength > 0) {
            this.stripe = Stripe('pk_test_KxBGgHiWSOm2SmM3Siy87w2w')
            const elements = this.stripe.elements();
            this.card = elements.create('card', { hidePostalCode: true })
            this.card.mount('#card-element')
        }


        

        const amount = this.cartTotalPrice.toFixed(2).toString();
        //console.log(amount)

        paypal.Buttons({
            onClick: () => {
                //console.log('onClick')
                //this.$store.commit('setCheckoutIsLoading', true)
                if (this.submitForm() > 0) {
                    console.log('Errors returning false')
                    //this.$store.commit('setCheckoutIsLoading', false)
                    return false;
                }
            },
            createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: amount
                        }
                    }]
                })
            },
            onApprove: (data, actions) => {

                const items = []
                for (let i = 0; i < this.cart.items.length; i++) {
                    const item = this.cart.items[i]
                    const obj = {
                        product: item.product.id,
                        quantity: item.quantity,
                        price: item.product.price * item.quantity
                    }
                    items.push(obj)
                }

                console.log(items)

                const formdata = {
                    'first_name': this.first_name,
                    'last_name': this.last_name,
                    'email': this.email,
                    'phone': this.phone,
                    'address': this.address,
                    'zipcode': this.zipcode,
                    'place': this.place,
                    'items': items,
                    'gateway': 'Paypal',
                    'stripe_token': 'no_stripe'
                    //'stripe_token': 'tok_123'

                    //Include:
                    //'gateway': 'paypal',
                    //'order_id': data.orderID,

                    //'coupon_code': this.coupon_code,
               
                              
              
                };

                return actions.order.capture().then(function(details) {

                    console.log('Capture result', details, JSON.stringify(details, null, 2));
                    var transaction = details.purchase_units[0].payments.captures[0];
                    console.log(transaction);

                    if( transaction.status == 'COMPLETED'){

                        axios
                            .post('/api/v1/checkout/', formdata)
                            .then(response => {
                                
                                console.log('Cart Sucess:', formdata)
                                window.location.href = window.location.origin.concat('/cart/success');

                            })
                            .catch(error => {
                                console.log(formdata)
                                console.log(error)
                                console.log(error.response)
                                
                                //console.log(typeof(error.response.formdata))
                                //this.errors.push('Something went wrong. Please try again')

                                // if(error.response.status == 400 && Object.keys(error.response.data).length === 0){
                                    
                                //     this.$store.commit('clearCart')
                                //     this.$store.commit('checkoutSuccess')

                            // } else{
                            //     this.errors.push('Something went wrong. Please try again')
                            // }

                        })


                    
                        // *** window.location.href = window.location.origin.concat('/cart/success');

                    } 

                    //   else{
                    //       this.$store.commit('setCheckoutIsLoading', false)
                    //   }



    
                    // this.$store.commit('setCheckoutIsLoading', false)

                  
                });

            }

        }).render('#paypal-button-container');


    },
    methods: {
        validateEmail(email) {
            email = email || "";
            let re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
            return re.test(email.toLowerCase().trim());
        },
        validatePhone(phone) {
            phone = phone || "";
            let re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
            return re.test(phone.toLowerCase().trim());
        },
        getItemTotal(item) {
            return item.quantity * item.product.price
        },
        submitForm() {
            this.errors = []
            if (this.first_name === '') {
                this.errors.push('The first name field is missing!')
            }
            if (this.last_name === '') {
                this.errors.push('The last name field is missing!')
            }
            if (this.email === '') {
                this.errors.push('The email field is missing!')
            } 
            else  if (this.validateEmail(this.email) == false) {
                this.errors.push('The email is not valid!')
            }
            if (this.phone === '') {
                this.errors.push('The phone field is missing!')
            } 
            else if(this.validatePhone(this.phone) == false){
                this.errors.push('The phone is not valid!')
            }
            if (this.address === '') {
                this.errors.push('The address field is missing!')
            }
            if (this.zipcode === '') {
                this.errors.push('The zip code field is missing!')
            }
            if (this.place === '') {
                this.errors.push('The place field is missing!')
            }
            if (!this.errors.length && this.websiteAccept == 'stripe') {
                //this.$store.commit('setIsLoading', true)
                this.$store.commit('setCheckoutIsLoading', true)
                this.stripe.createToken(this.card).then(result => {                    
                    if (result.error) {
                        //this.$store.commit('setIsLoading', false)
                        this.$store.commit('setCheckoutIsLoading', false)
                        this.errors.push('Something went wrong with Stripe. Please try again')
                        console.log(result.error.message)
                    } else {
                        //console.log(result.token)
                        this.stripeTokenHandler(result.token)
                    }
                })
            }

            return this.errors.length;
        },
        async stripeTokenHandler(token) {
            const items = []
            for (let i = 0; i < this.cart.items.length; i++) {
                const item = this.cart.items[i]
                const obj = {
                    product: item.product.id,
                    quantity: item.quantity,
                    price: item.product.price * item.quantity
                }
                items.push(obj)
            }
            const data = {
                'stripe_token': token.id,
                'first_name': this.first_name,
                'last_name': this.last_name,
                'email': this.email,
                'address': this.address,
                'zipcode': this.zipcode,
                'place': this.place,
                'phone': this.phone,
                'items': items,
                'gateway': 'Stripe'
            }
            await axios
                .post('/api/v1/checkout/', data)
                .then(response => {
                    console.log(data)
                    this.$store.commit('clearCart')
                    this.$store.commit('checkoutSuccess')
                    //this.$router.push('/cart/success')
                    //window.location.href = "http://localhost:8080/cart/success"

                })
                .catch(error => {
                    console.log(data)
                    console.log(error)
                    console.log(error.response)
                    console.log(data)
                    //console.log(typeof(error.response.data))
                    //this.errors.push('Something went wrong. Please try again')
                    if(error.response.status == 400 && Object.keys(error.response.data).length === 0){
                        
                        this.$store.commit('clearCart')
                        this.$store.commit('checkoutSuccess')
                        //this.$router.push('/cart/success')
                        //window.location.href = "http://localhost:8080/cart/success"

                    } else{
                        this.errors.push('Something went wrong. Please try again')
                    }
                    

                })
                //this.$store.commit('setIsLoading', false)
                this.$store.commit('setCheckoutIsLoading', false)
        }
    },
    computed: {
        cartTotalPrice() {
            return this.cart.items.reduce((acc, curVal) => {
                return acc += curVal.product.price * curVal.quantity
            }, 0)
        },
        cartTotalLength() {
            return this.cart.items.reduce((acc, curVal) => {
                return acc += curVal.quantity
            }, 0)
        }
    }
}
</script>

<style lang="less">
    //@import "../node_modules/bulma/css/bulma.css";

    .checkout_form_wrap{
        position: relative;
    }

    .is-loading-bar.is-loading.checkout_loading_wrap{
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        height: 100%;
        background-color: #d3d3d36e;
        user-select: none;
        // display: flex;
        align-items: center;
        justify-content: center;

        .lds-dual-ring{
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            margin: auto;

            -webkit-animation: lds-dual-ring 1.2s linear infinite;
            animation: lds-dual-ring 1.2s linear infinite;
        }
    }


</style>