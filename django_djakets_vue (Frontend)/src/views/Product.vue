<template>
    <div class="page-product">
        <div class="columns is-multiline">
            <div class="column is-9">
                <figure class="image mb-6">
                    <img v-bind:src="product.get_image">
                </figure>

                <h1 class="title">{{ product.name }}</h1>

                <p>{{ product.description }}</p>
            </div>

            <div class="column is-3">
                <h2 class="subtitle">Information</h2>

                <p><strong>Price: </strong>${{ product.price }}</p>

                <div v-if="product.quantity == '0.00'" class="field has-addons mt-6">
                    <p><strong></strong>Out Of Stock</p>
                </div>

                <div v-else class="field has-addons mt-6 addToCartBtnWrap">

                    <div class="control">
                        <input type="number" class="input" min="1" v-model="quantity">
                    </div>

                    <div class="control">
                        <a class="button is-dark" @click="addToCart()">Add to cart</a>
                    </div>

                    <div class="is-loading-bar has-text-centered cart_loading_wrap" v-bind:class="{'is-loading': $store.state.addToCartLoading }">
                        <div class="lds-dual-ring"></div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>


<script>
import axios from 'axios';
import { toast } from "bulma-toast";

export default {
    name: 'Product',
    data() {
        return {
            product: {},
            quantity: 1
        }
    },
    mounted() {
        this.getProduct() 
        //this.$store.commit('addToCartLoading', true)
    },
    methods: {
        async getProduct() {
            this.$store.commit('setIsLoading', true)
            const category_slug = this.$route.params.category_slug
            const product_slug = this.$route.params.product_slug
            await axios
                .get(`/api/v1/products/${category_slug}/${product_slug}`)
                .then(response => {
                    //console.log(response.data)
                    this.product = response.data
                    document.title = this.product.name + ' | Djackets'
                })
                .catch(error => {
                    console.log(error)
                })
            
            this.$store.commit('setIsLoading', false)
        },
        addToCart() {
            this.$store.commit('addToCartLoading', true)
            if (isNaN(this.quantity) || this.quantity < 1) {
                this.quantity = 1
            }
            const item = {
                product: this.product,
                quantity: this.quantity
            }
            if(item.product.price > 0){
                this.$store.commit('addToCart', item)
                if(this.$store.state.addToCartLoading === true){
                    this.$store.commit('addToCartLoading', false)
                }
                toast({
                    message: 'The product was added to the cart',
                    type: 'is-success',
                    dismissible: true,
                    pauseOnHover: true,
                    duration: 2000,
                    position: 'bottom-right',
                })
            }
        }
    }
}
</script>

<style lang="less">
    //@import "../node_modules/bulma/css/bulma.css";

    .addToCartBtnWrap{
        position: relative;
    }

    .field.has-addons .control:not(:last-child){
        margin: 0;
    }

    .is-loading-bar.is-loading.cart_loading_wrap{
        position: absolute;
        background: #fff;
        height: 40px;
        width: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 5;

        .lds-dual-ring{
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            height: -webkit-fill-available
        }

        .lds-dual-ring{
            -webkit-animation: lds-dual-ring 1.2s linear infinite;
            animation: lds-dual-ring 1.2s linear infinite;
        }

        .lds-dual-ring::after{
            width: 35px;
            height: 35px;
        }


    }
    


      @media (max-width: 767px) {

          .page-product .column {

              h1{
                  text-align: center;
              }

               h2{
                  text-align: center;
              }

              p{
                  text-align: center;
              }

              .field.has-addons{
                justify-content: center;
                position: relative;

                .control{
                    width: fit-content;
                }

                .is-loading-bar{
                    position: absolute;
                }

              }
          }
      }


</style>