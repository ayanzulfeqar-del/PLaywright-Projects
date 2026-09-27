Feature: e-commerce web e2e test
  As a registered customer of the Toolshop website
  I want to log in, search, buy products and manage my account
  So that I can shop online without problems

  Background:
    Given the user is on the login page

  @smoke @login
  Scenario: Login with valid email and password
    When the user logs in with email "user@gmail.com" and password "User12@?"
    Then the "My account" page is shown for user "Test User"

  @login @negative
  Scenario Outline: Login with wrong details shows an error
    When the user logs in with email "<email>" and password "<password>"
    Then the error message "Invalid email or password" is shown

    Examples:
      | email              | password   |
      | user@gmail.com     | Wrong123!  |
      | nobody@gmail.com   | User12@?   |

  @smoke @home
  Scenario: Home page shows the product list after login
    When the user logs in with email "user@gmail.com" and password "User12@?"
    And the user clicks on Home
    Then the product list, search box and sort dropdown are visible

  @search
  Scenario: Search for a product by name
    When the user logs in with email "user@gmail.com" and password "User12@?"
    And the user clicks on Home
    And the user searches for "Pliers"
    Then every product shown contains "Pliers"

  @search @negative
  Scenario: Search with no matching product
    When the user logs in with email "user@gmail.com" and password "User12@?"
    And the user clicks on Home
    And the user searches for "xyz123abc"
    Then the message "There are no products found." is shown

  @sort
  Scenario Outline: Sort products by price
    When the user logs in with email "user@gmail.com" and password "User12@?"
    And the user clicks on Home
    And the user sorts the products by "<option>"
    Then the prices are in "<order>" order

    Examples:
      | option              | order      |
      | Price (Low - High)  | ascending  |
      | Price (High - Low)  | descending |

  @sort
  Scenario: Sort products by name A to Z
    When the user logs in with email "user@gmail.com" and password "User12@?"
    And the user clicks on Home
    And the user sorts the products by "Name (A - Z)"
    Then the product names are in alphabetical order

  @filter
  Scenario: Filter products by category
    When the user logs in with email "user@gmail.com" and password "User12@?"
    And the user clicks on Home
    And the user filters by category "Hammer"
    Then every product shown contains "Hammer"

  @smoke @cart @checkout
  Scenario: Add a product to cart and place an order
    When the user logs in with email "user@gmail.com" and password "User12@?"
    And the user clicks on Home
    And the user opens the product "Bolt Cutters"
    And the user sets quantity to 2 and adds it to the cart
    Then the message "Product added to shopping cart." is shown in a popup
    And the cart shows 2 items
    When the user opens the cart
    Then the cart has "Bolt Cutters" with quantity 2 and the correct total
    When the user continues to the billing step
    And the user enters this billing address
      | country  | postcode | house | street      | city       | state  |
      | Pakistan | 52250    | 12    | Main Road 1 | Gujranwala | Punjab |
    And the user pays with "Cash on Delivery"
    Then the payment message "Payment was successful" is shown

  @profile
  Scenario: Profile shows the correct user data and can be updated
    When the user logs in with email "user@gmail.com" and password "User12@?"
    And the user opens My Profile
    Then the profile shows first name "Test", last name "User" and email "user@gmail.com"
    When the user changes the phone number to "03001234567"
    Then the profile message "Your profile is successfully updated!" is shown

  @contact
  Scenario: Send a message with the contact form
    When the user logs in with email "user@gmail.com" and password "User12@?"
    And the user opens the Contact page
    And the user sends a message with subject "Customer service" and text "Hello, I would like to know more about the delivery time of my order please."
    Then the contact message "Thanks for your message!" is shown

  @contact @negative
  Scenario: Contact form rejects a message that is too short
    When the user logs in with email "user@gmail.com" and password "User12@?"
    And the user opens the Contact page
    And the user sends a message with subject "Customer service" and text "Too short"
    Then the contact error "Message must be minimal 50 characters" is shown

  @logout
  Scenario: Logout from the account
    When the user logs in with email "user@gmail.com" and password "User12@?"
    And the user logs out
    Then the user is back on the login page
