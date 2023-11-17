backend help :


#USER
1- register a new user :
    send a POST request to .../register
    it must be a json
    request parameters : email, username, password

   All error responses : 
            "some of inputs are empty"
            "email is incorrect"
            "some of the inputs characters not allowed"
            "An error occurred. Please try again later."
            "This email is already in use. Please choose a different email!"
            "An error occurred. Please try again later."

    good response : 
            "New user created."
            new accessToken and refreshToken will created.




2- login a user:
    send a POST request to .../login
    it must be a json
    request parameter : email, password

        All error responses:
            "fields are empty"
            "Email is not valid"
            "some of the inputs characters not allowed"
            "An error occurred. Please try again later."
            "email is not valid"
            "password is incorrect!"

        good response:
            "you are loged in."
            new accessToken and refreshToken will created.


3- add address for a user : 

        send a POST request to .../addAdressToUser
        it must be a json

        request parameter :

                {
                "firstName": "firstName",
                "lastName": "lastName",
                "addressStreet": "addressStreet",
                "addressCity": "addressCity",
                "addressZip": "addressZip",
                "houseNr": houseNr,
                "mobile": "mobile"
                                 }

        error responses because of tokens:
                message: "Unauthorized"
                message: "you must first login"
                message: "email is not valid"

        error responses:
                message: error.message

        good response:
                 message: Address of user: ${email} added successfully

4- update the user address:

        send a POST request to .../updateAddressOfUser
        the user email is coming from tokens

        error responses because of tokens:
                message: "Unauthorized"
                message: "you must first login"
                message: "email is not valid"

        error responses because of body:
                message: "No fields to update provided"
                message: `Invalid field(s) to update: ${invalidFields.join(", ")}`

        good response:
        `Address of user: ${email} updated successfully`

5- deleteAddressOfUser
        send a POST request to .../deleteAddressOfUser
        the user email is coming from tokens

        All error responses:
                message: error.message
                message: `No address found for user: ${email}`

        good response:
                `Address of user: ${email} deleted successfully`

6- showUserAddress
        send a GET request to .../showUserAddress
        the user email is coming from tokens

        All error responses:
                message: error.message
                `No address found for user: ${email}`

        good response:
                address: result





#CRM

1- login Admin:

    send a POST request to .../adminLogin
    it must be a json
    request parameter : username, password

    All error responses:
            "fields are empty"
            "Username or Password is incorrect"

    good response:
            "Admin Welcome"
            new adminAccessToken and adminRefreshToken will created.

2- create a new product
    only admin can create the product
    send a POST request to .../addproduct
    a accessToken must send that show the data is from admin
    data must be : sex, category, brand, name, price, availability, deliveryTime, tags, image

        error responses because of tokens:
                message: "Unauthorized"
                message: "you must first login"
                message: "email is not valid"

        All error responses:
            "An error occurred. Please try again later."
            "there is no images."

        good response: 
            "Product added successfully"

            image will stored in images folder with this name :ItemId--Date.now()--file.originalname





#PRODUCT
1- show products for a page :

        send a GET request to .../showProduct
        it must be a json
        request parameter: {sex: "sex", category: "category"}

        error responses:
                message: "sex and category must enter"
                message: "there is no product with these sex and category"
                message: err.message

        good response:
                products: results
                get the image of every product from image folder



2- show a single product :

        send a GET request to .../product/{itemId}
        itemId of the product must given in the url 
        
        error responses:
                message: "Product not found"
                 message: err.message

        good response:
                result: result
                get the image of the product from image folder



#SHOPPIN_CART

1- addProductToUserCart
        send a POST request to .../addProductToUserCart/id/quantity
        itemId and quantity of product must be in url

        error responses:
                message: "itemId or quantity is null."
                message: "Invalid itemId or quantity"
                message: "Product not found"
                message: error.message

        good response:
                `Product with itemId: ${itemId} and quantity ${quantity} added to user's cart`
                `Product with itemId: ${itemId} updated to quantity ${quantity} in user's cart`

2- addSameProductToCart
        send a POST request to .../addSameProductToCart/id
        itemId of product must be in url

        error responses:
                message: "itemId is null."
                message: "itemId is incorrect"
                message: error.message

        good response:
                message: "This product is not in the basket."
                message: `Quantity of the product is now: ${newQuantity}`

3-  showCartOfUser
        send a GET request to .../showCartOfUser

         error responses:
                message: "No product is in the basket."
                message: error.message

        good response:
                basketItems: result

4- userCartFinalPay
        send a GET request to .../userCartFinalPay

        error responses:
               message: "User address not found"
               message: "No items found in the user's cart"
               message: error.message

        good response:
                address: userAddress,
                totalAmount: totalAmount,
                items: basketItemsResult.map((item) => ({ itemId: item.itemId }))

5- deleteProductFromCart
        send a POST request to .../deleteProductFromCart/id
        itemId and quantity of product must be in url

        error responses:
                message: "itemId is null."
                message: "itemId is incorrect"
                message: "This product is not in the basket."
                message: error.message

        good response:  
                message: `Quantity of the product is now: ${newQuantity}`  


