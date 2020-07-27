export const payPalBody = (total) => {
  return {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "transactions": [{
      "amount": {
        "total": total,
        "currency": "USD",
        /*"details": {
          "subtotal": "35.00",
          "tax": "2.00",
          "shipping": "2.50",
          "handling_fee": "1.00",
          "shipping_discount": "-1.00",
          "insurance": "2.00"
        }*/
      },

      "description": "Veuillez effectuer votre paiement.",
      "custom": "This is a hidden value",
      "invoice_number": "unique_invoice_number",

      "soft_descriptor": "your order description",
      /*"item_list": {
        "items": [{
          "name": "Item 1",
          "description": "Le truc to buy",
          "quantity": "2",
          "price": "20.00",
          "sku": "1",
          "currency": "USD"
        },
          {
            "name": "Voucher",
            "description": "discount on your order",
            "quantity": "1",
            "price": "-5.00",
            "sku": "vouch1",
            "currency": "USD"
          }
        ]
      }*/
    }],
    "note_to_payer": "Contact us for any questions on your order.",
    "redirect_urls": {
      "return_url": "https://example.com", // Please put "https instead of http"
      "cancel_url": "https://example.com"
    }
  }
}
