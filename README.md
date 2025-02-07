Node js Charity Registration API

## Setup

```
    $ git clone 
    $ npm install
    $ npm run dev - to run on localhost 5000
```

## API Endpoints

## User Routes

### * Create User

`POST |  /user/signup` 

| Key       | Value          |
| --------- | -----------    |
| name      | Admin          |
| email     | admin@admin.com|
| password  | password       |
| phone     | +947187520     |

### * Login User

`POST |  /user/login` 

| Key        | Value          |
| ---------  | -----------    |
| email      | admin@admin.com|
| password   | password       |

### * Get Users

`GET |  /user/user-data` 

### * Get Single Users

`GET |  /user/user-data/:id` 

### * Update Single User

`PUT |  /user/user-update`

### * Create Charity

`POST |  /charity/register-charity`
  "name",
  "email",
  "phoneNumber",
  "category",
  "beneficiary",
  "beneficiaryName",
  "relation",
  "beneficiaryLocationState",
  "beneficiaryLocationCity",
  "beneficiaryMobileNumber",
  "funds",
  "hospitalName",
  "hospitalLocationState",
  "hospitalLocationCity",
  "medicalCondition",
  "hospitalisationStatus",
  "date",
  "fundraiserName",
  "storyForFundraising"

### * Get All Charity

`GET |  /charity/single-charity-data` 

### * Get Single Charity

`GET |  /charity/single-charity-data/:id` 

### * Get Charity By Category

`GET |  /charity/get-charity-category/:categoryName`

### * Get Charity By Location

`GET |  /charity/get-charity-category/:locationName`

### * Update Charity

`PUT |  /charity/charity-update/:id`
  "category",
  "beneficiary",
  "beneficiaryName",
  "relation",
  "funds",
  "hospitalName",
  "hospitalLocationState",
  "hospitalLocationCity",
  "medicalCondition",
  "hospitalisationStatus",
  "date",
  "fundraiserName",
  "storyForFundraising"

  ### * Donate Money
  
`PUT |  purchase/donate`

"amount"

  ### * Update Money
  
`PUT |  purchase/updatetransactionstatus`

payment_id,
order_id

--------------------------------------------------------
## Admin Routes

### * Create Admin

`POST |  /admin/signup` 

"name",
"email",
"phoneNumber",
"password"

### * Login Admin

`POST |  /admin/login` 

| Key        | Value          |
| ---------  | -----------    |
| email      | admin@admin.com|
| password   | password       |

### * Delete User

`POST |   /admin/manageUser-delete/:email`


### * Accept Charity

`POST |   /admin/manageCharity-accept/:registrationId`


### * Reject Charity

`POST |   /admin/manageCharity-reject/:registrationId`

## License

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:










































