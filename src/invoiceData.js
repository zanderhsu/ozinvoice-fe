import Utility from "./utils"

const InvoiceEmptyData = {
  "payee": {
      "business_name": "",
      "ABN": "",
      "address": "",
      "email":"",
      "phone":""  
    },

  "payer": {
      "business_name": "",
      "ABN": "",
      "address": "",
      "phone":"",
      "email":""
    },
 
    "payment":{
      "account_name":"",
      "BSB": "",
      "account_number": "",
      "note": "",
      "invoice_number":"",
      "invoice_date":Utility.getCurrentDateString(),
      "due_date": Utility.getCurrentDateString()
    },
    "items":[{
        "code":"1",
        "description":"",
        "unit_price":"0",
        "quantity":"1",
        "tax_rate": "10",
        "discount":"0",
        "amount":"0"
      }]
}

const InvoiceSampleData = {
    "payee": {
        "business_name": "OZ GREAT PTY LTD",
        "ABN": "12543534",
        "address": "34 Lucky Rd, Goodplace, NSW 2000",
        "email":"info@success.com.au",
        "phone":"0282343242"  
      },

    "payer": {
        "business_name": "David Harris",
        "ABN": "12343434",
        "address": "234 Happy Rd, Rosewood, NSW 2000",
        "phone":"0482343242",
        "email":"david@gmail.com"
      },
   
      "payment":{
        "account_name":"OZ GREAT PTY LTD",
        "BSB": "234355",
        "account_number": "254535435",
        "note": "please use invoice number as reference",
        "invoice_number":`INV-${Utility.getCurrentDateString()}-001`,
        "invoice_date":Utility.getCurrentDateString(),
        "due_date": Utility.getCurrentDateString()
      },
      "items":[{
          "code":"101",
          "description":"H3 Treated timber 90x45x3000mm",
          "unit_price":"9.9",
          "quantity":"20",
          "tax_rate": "10",
          "discount":"10",
          "amount":"0"
        },{
          "code":"221",
          "description":"Concret 20KG",
          "unit_price":"8.8",
          "quantity":"80",
          "tax_rate": "10",
          "discount":"20",
          "amount":"0"
        }]
}

export {InvoiceEmptyData, InvoiceSampleData}