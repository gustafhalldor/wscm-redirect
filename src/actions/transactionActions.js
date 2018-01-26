export function addBasketContents(basketContents) {
  return {
    type: 'ADD_BASKET_CONTENTS',
    payload: basketContents
  }
}

export function addCustomerInfo(custInfo) {
  return {
    type: 'ADD_CUSTOMER_INFO',
    payload: custInfo
  }
}

export function addTotalProducsWeight(weight) {
  return {
    type: 'ADD_TOTAL_PRODUCTS_WEIGHT',
    payload: weight
  }
}

export function addTotalProductsPrice(price) {
  return {
    type: 'ADD_TOTAL_PRODUCTS_PRICE',
    payload: price
  }
}
