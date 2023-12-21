# CMS for Food Ordering Websites

This website is CMS (Content Management System) for food ordering websites. Using this website users can add, update and delete contents for food ordering websites such as tables, menus and food images. This website has responsive user interface supporting both mobile and desktop view.

## URL

**Available at:** <a href='https://dashboard-blush-theta.vercel.app/'>https://dashboard-blush-theta.vercel.app/</a>\
**Test email address:** test@email.com\
**Test password:** test1234

## Technologies Used

![Diagram](https://github.com/hjkim115/dashboard/blob/main/public/readMeImage/diagram.png)

- Developed user interface of the website using **Next.js (React.js)** and **TypeScript (JavaScript)**.
- Developed **API** that provides presigned temporary URL for uploading images to **AWS S3 bucket** using **Next.js API routes** and **AWS Modular SDKs**.
- Connected user interface with **Firestore** cloud database and added user **authentication** features using **Firebase SDK**.
- Used **AWS S3 bucket** and **Cloudfront CDN** to dynamically serve and update food images.

## Features

### Home

![Home](https://github.com/hjkim115/dashboard/blob/main/public/readMeImage/home.png)

- Users have to authenticate using their email address and password in order to start using this website.
- On the 'home' page different types of contents are displayed with count for each one.
- Using buttons in the header users can navigate to other pages.

### Settings

![Settings](https://github.com/hjkim115/dashboard/blob/main/public/readMeImage/settings.png)

- Users can change company name and logo image that are going to be displayed in food ordering websites.

### Categories

![Categories](https://github.com/hjkim115/dashboard/blob/main/public/readMeImage/categories.png)

- Users can add a new category by clicking the 'add category' button and submitting a form.
- Users can edit existing category by clicking the pencil shaped button and submitting a form.
- Users can delete category by clicking the pencil shaped button and clicking 'delete' button.

### Menus

![Menus](https://github.com/hjkim115/dashboard/blob/main/public/readMeImage/menus.png)

- Users can filter menus by category using the filter at the top of the 'menus' page.
- Users can add a new menu by clicking the 'add menu' button which opens modal form, and submitting the form.
- By clicking pencil shaped button users can navigate to 'edit menu' page.

### Edit Menu

![Edit Menu](https://github.com/hjkim115/dashboard/blob/main/public/readMeImage/editMenu.png)

- Users can change menu data such as name and category by submitting 'edit menu' form.
- Users can change menu image by clicking 'edit image' button, uploading new image and submitting the form.
- At the bottom of this page options are displayed.

![Options](https://github.com/hjkim115/dashboard/blob/main/public/readMeImage/options.png)

- Users can click on plus shaped button to add and pencil shaped button to edit or delete option categories and options.

### Tables

![Tables](https://github.com/hjkim115/dashboard/blob/main/public/readMeImage/tables.png)

- Users can add a new table by clicking the 'add table' button and submitting a form.
- Users can edit existing table by clicking the pencil shaped button and submitting a form.
- Users can delete table by clicking the pencil shaped button and clicking 'delete' button.
