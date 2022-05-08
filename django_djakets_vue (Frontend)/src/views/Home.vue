<template>
  <div class="home">

    <!-- <Carousel :autoplay="4000" :wrap-around="true" class="mb-6">
      <Slide v-for="slide in slides" :key="slide.title">
        <div class="carousel__item" :style="{ backgroundImage: `url(${slide.image_link})` }">
          <div class="carousel_title">{{ slide.title }}</div>
          <div class="carousel_subtitle"> {{slide.subtitle}}</div>
        </div>
      </Slide> -->

      <Carousel v-if="slidedArr.length" :autoplay="4000" :wrap-around="true" class="mb-6">
        <Slide v-for="slide in slidedArr" :key="slide[1]['id']">
          <div class="carousel__item" :style="{ 'background-image': `url(${slide[1]['get_slide_image']})` }">
            <div class="carousel_title">{{ slide[1]['title'] }}</div>
            <div class="carousel_subtitle"> {{slide[1]['description']}}</div>
          </div>
        </Slide>

        <template #addons>
          <Pagination />
        </template>
    </Carousel>

    <!-- <Carousel :autoplay="4000" :wrap-around="true" class="mb-6">
        <Slide v-for="slide in latestSlides" :key="slide">
          <div class="carousel__item">
            <div class="carousel_title">title</div>
            <div class="carousel_subtitle">desc</div>
          </div>
        </Slide>

        <template #addons>
          <Pagination />
        </template>
    </Carousel> -->

    <!-- <section class="hero is-medium is-dark mb-6" >
        <div class="hero-body has-text-centered">
            <p class="title mb-6">
                {{latestSlides[0]}}
            </p>
            <p class="subtitle">
                {{latestSlides[0]}}
            </p>
        </div>
    </section> -->

    <!-- <section class="hero is-medium is-dark mb-6">
        <div class="hero-body has-text-centered">
            <p class="title mb-6">
                Welcome to Django Jackets
            </p>
            <p class="subtitle">
                The best jacket store online
            </p>
        </div>
    </section> -->


    <div class="columns is-multiline">
      <div class="column is-12">
          <h2 class="is-size-2 has-text-centered">Latest products</h2>
      </div>

      <ProductBox 
        v-for="product in latestProducts"
        v-bind:key="product.id"
        v-bind:product="product" />

    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ProductBox from '@/components/ProductBox'

// If you are using PurgeCSS, make sure to whitelist the carousel CSS classes
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';


export default {
  name: 'Home',
  data() {
    return {
      latestProducts: [],
      latestSlides: [],
      slides: [
          { id: 1, title: 'Welcome to Django Jackets', description:'The best jacket store online', get_slide_image: 'https://isaacg333.pythonanywhere.com/media/uploads/pexels-matt-hardy-2567959_DPJcO4f.jpg' },
          { id: 2, title: 'Test Title 2', description:'ddfd', get_slide_image:'' }
      ],
      slidedArr: [],
    }
  },
  components: {
    ProductBox,

    Carousel,
    Slide,
    Pagination,
    Navigation,


  },

  beforeMount(){
    this.getLatestSlides()
  },

  mounted() {

    //this.getLatestSlides()

    this.getLatestProducts()
    document.title = 'Home | Djackets'
  },

  methods: {
    //getting the products
    async getLatestProducts() {
      this.$store.commit('setIsLoading', true)
      await axios
        .get('/api/v1/latest-products/')
        .then(response => {
          //console.log(response.data)
          this.latestProducts = response.data
        })
        .catch(error => {
          console.log(error)
        })
      this.$store.commit('setIsLoading', false)
    },
    //getting the slides
    async getLatestSlides() {
      this.$store.commit('setIsLoading', true)
      await axios
        .get('/api/v1/latest-slides/')
        .then(response => {
          this.latestSlides = response.data
          //console.log(this.latestSlides)
          //console.log(this.slides)

          this.slidedArr = Object.entries(this.latestSlides);
          console.log(this.slidedArr.length);
          //console.log(this.slidedArr[0]);
          //console.log(this.slidedArr[1]);

        })
        .catch(error => {
          console.log(error)
        })
      this.$store.commit('setIsLoading', false)
    }
  }

};
</script>


<style >
  .prod-box .image {
    margin-top: -1.25rem;
    margin-left: -1.25rem;
    margin-right: -1.25rem;
  }


  .carousel__item {
    min-height: 400px;
    /* padding: 9rem 4.5rem; */
    width: 100%;
    background-color: #363636;
    /* background-color: var(--vc-clr-primary);*/
    color: var(--vc-clr-white);
    /* font-size: 20px; */
    /* border-radius: 8px; */
    display: flex;
    justify-content: center;
    align-items: center;

    display: flex;
    flex-direction: column;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    background-color: rgb(0 0 0 / 41%);
    background-blend-mode: overlay;
  }

  /* .carousel__slide {
    padding: 10px;
  } */

  .carousel__pagination-button{
    background-color: #36363699;
  }

  .carousel__pagination-button--active{
    background-color: #363636;
  }

  .carousel_title{
    font-size: 2rem;
    font-weight: 600;
    line-height: 1.125;
    color: #fff;
    margin-bottom: 2rem !important;
  }

  .carousel_subtitle{
    font-size: 1.25rem;
    font-weight: 400;
    line-height: 1.25;
    color: #fff;
  }

</style>
