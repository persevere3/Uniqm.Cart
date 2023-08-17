.products {
  width: 1170px;
  padding: 15px 15px 30px 15px;
  margin: 0 auto 2%;

  .title {
    padding: 10px 0 25px;
    margin-bottom: 28px;
    text-align: center;
    letter-spacing: 3px;
    font-size: 22px;
    color: #666;
    position: relative;

    &:before {
      content: '';
      width: 25px;
      height: 3px;
      position: absolute;
      left: 50%;
      bottom: -3px;
      margin-left: -12.5px;
      background-color: $primary_color;
    }
  }

  .product_list {
    ul {
      display: flex;
      flex-wrap: wrap;

      li {
        width: 25%;
        padding: 0px 15px;
        margin-bottom: 15px;
        cursor: pointer;

        .pic {
          width: 100%;
          padding-bottom: 100%;
          background-size: cover;
          background-position: center;
          position: relative;

          &:before {
            content: '';
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            background: rgba(0, 0, 0, 0.5);
            display: none;
          }

          .addTo_cart_btn, .addTo_favorite_btn {
            width: auto;
            height: 40px;
            position: absolute;
            left: 10px;
            right: 10px;
            bottom: 10px;
            border-radius: 3px;
            background: #fff;
            color: #333;
            font-size: 14px;
            display: none;
            justify-content: center;
            align-items: center;
            transition: 0.4s;

            &:hover {
              background: $primary_color;
              color: #fff;
            }
          }

          .addTo_favorite_btn {
            bottom: 60px;

            .fa-heart {
              margin-left: 5px;
            }
            .is_favorite {
              color: red;
            }
          }
        }

        .info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          .name {
            width: 100%;
            margin-top: 10px;
            margin-bottom: 4px;
            text-align: center;
            line-height: 1.4;
            font-size: 14px;
            color: #333;
            @include single_ellipsis;
          }

          .discount_price {
            font-size: 16px;
            font-weight: bold;
            color: $primary_color;
            @include single_ellipsis;
          }
          .origin_price {
            margin-bottom: 5px;
            text-decoration: line-through;
            font-size: 14px;
            color: #888;
            @include single_ellipsis;
          }
        }

        .l_addTo_cart_btn, .l_addTo_favorite_btn{
          height: 32px;
          margin-top: 5px;
          border-radius: 3px;
          background-color: #f7f7f7;
          color: $primary_color;
          justify-content: center;
          align-items: center;
          display: none;

          .is_favorite {
            color: red;
          }
        }

        &:hover {
          .pic {
            &:before {
              display: block;
            }

            .addTo_cart_btn, .addTo_favorite_btn {
              display: flex;
            }
          }
        }
      }
    }
  }

  .product_page {
    padding: 15px;
    display: flex;
    justify-content: center;

    ul {
      padding: 20px 0px;
      display: flex;

      li {
        padding: 6px 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        &:hover {
          color: $primary_color;
        }
      }

      .opacity0 {
        opacity: 0.3;
      }

      .li_active {
        border-bottom: 2px solid $primary_color;
      }
    }
  }

  .no_product {
    padding: 45px 0px 0px 0px;
    display: flex;
    flex-direction: column;
    align-items: center;

    h3 {
      color: #555;
    }
    h4 {
      color: #777;
    }
  }
@include xl {
  .products {
    width: 970px;
  }
}
@include l {
  .products {
    width: 750px;

    .product_list {
      ul {
        li {
          width: 50%;

          .l_addTo_cart_btn, .l_addTo_favorite_btn {
            display: flex;
          }

          &:hover {
            .pic {
              &:before {
                display: none;
              }
              .addTo_cart_btn, .addTo_favorite_btn {
                display: none;
              }
            }
          }
        }
      }
    }
  }
}
@include m {
  .products {
    width: 100%;

    .product_list {
      ul {
        li {
          padding: 0px 8px;
        }
      }
    }
  }
}