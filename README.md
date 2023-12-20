# CMS for Food Ordering Websites

This website is CMS (Content Management System) for food ordering websites. Using this website users can add, update and delete contents for food ordering websites such as tables, menus and food images. This website has responsive user interface supporting both mobile and desktop view.

## URL

**Available at:** <a href='https://dashboard-blush-theta.vercel.app/'>https://dashboard-blush-theta.vercel.app/</a>\
**Test email address:** test@email.com\
**Test password:** test1234

## Technologies Used

![Diagram](https://github.com/hjkim115/dashboard/blob/main/public/readMeImage/diagram.png)

- Developed user interface of the website using **Next.js (React.js)** and **TypeScript (JavaScript)**.
- Developed **API** that provides presigned temporary URL for uploading images to **AWS S3 bucket** using **AWS Modular SDKs**.
- Connected user interface with **Firestore** cloud database and added user **authentication** features using **Firebase SDK**.
- Used **AWS S3 bucket** and **Cloudfront CDN** to dynamically serve and update food images.

## Features

### Home

![Home](https://github.com/hjkim115/dashboard/blob/main/public/readMeImage/home.png)

- On the homepage restaurant's logo and table number are displayed, and users can go to the menus page by clicking the 'order now' button.

### Settings

![Settings](https://github.com/hjkim115/dashboard/blob/main/public/readMeImage/settings.png)

### Categories

![Categories](https://github.com/hjkim115/dashboard/blob/main/public/readMeImage/categories.png)

- Users can filter menus by category using the scroll buttons at the top of the 'menus' page.
- When users select menu they want, they will be taken to the page, where they can select options and quantity and add to cart.
- Once users have added menu to the cart, they can navigate to the 'cart' page by clicking the cart button at the bottom of the 'menus' page.

### Menus

![Menus](https://github.com/hjkim115/dashboard/blob/main/public/readMeImage/menus.png)

- On the 'cart' page, users can delete or change the quantity of selected items before placing the order.
- Once an order is completed, order details are displayed with button that returns to 'home' page.

### Edit Menu

![Edit Menu](https://github.com/hjkim115/dashboard/blob/main/public/readMeImage/editMenu.png)

![Options](https://github.com/hjkim115/dashboard/blob/main/public/readMeImage/options.png)\

### Tables

![Tables](https://github.com/hjkim115/dashboard/blob/main/public/readMeImage/tables.png)
