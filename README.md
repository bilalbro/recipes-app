# Recipes App

A fully-fledged recipe-managing SPA, built using React and [FrontendDB](https://github.com/bilalbro/frontend-db).

https://github.com/bilalbro/recipes-app/assets/98707204/cefa4f34-dd44-494d-b93c-368ae5076c05

## Running the app on your end

Since this entire app runs on the frontend, there is nothing that you need to set up on your end, such as database systems, to get it into action.

All you need to do is first clone the repo using the following command:

```
> git clone https://github.com/bilalbro/recipes-app
```

And then run the following commands, in the order shown:

```
> npm install
> npm start
```

This will get a server instance running on port 3000. Now just go to your favorite browser and navigate to `http://localhost:3000` and *voila!*

## Motivation

Besides programming, I really love to do cooking/baking. I enjoy the activity so much and take it so precisely that I have a whole collection of my own recipes to manage. There is literally a lot to do in this regard — write new recipes, iterate over previous ones, rate the recipes, give reviews so that I know where to tweak the recipes, and a lot more suchlike.

For a long time, I had been managing all this in a physical notebook (*yeah, it works well in the beginning*). But, needless to say, at one point not very far off, the notebook started to become a real trouble to manage. Almost every single recipe page got filled with pen marks, striking through ingredients, quantities, reviews, and what not.

Now, as a programmer, you could've imagined what was going through my mind at this stage. Let's build a recipe-managing application with all the feature that *I* want.

And behold! Project `recipes-app` begins.

## Features

Here's a quick summary of the features of the app:

- Create new recipes (with groups of ingredients, reviews, yields, and much more)
- View recipes, with an indication of which ingredients have been scaled up or down compared to the previous iteration
- Update recipes
- Delete recipes
- Iterate over existing recipes to improve them
- Copy recipes to take them into a completely new course
- Create new ingredients/categories
- View all ingredients/categories
- Update names of ingredients/categories
- Delete ingredients/categories
- Perform a data backup
- Reset the app's data
- Restore data using a backup file

## Technologies used

Let's now talk about the technologies that I used to build this app.

### React

The application is a SPA (Single-Page Application) and React is pretty good at creating these along with React Router. We get a very intuitive approach to break down the logic of our app into these composable and reusable components, making overall maintenance really seamless. So, my choice was React, hands down.

### TypeScript

Instead of directly inlining model interaction code inside of components, using `useEffect()` hooks, I decided to create a class `RecipeList` and a class `ItemSet` and leave off all the model-associated logic to them both. This made sense because I was using React Router, where we fetch data of the app in loaders and then relay that data forward to the corresponding components. These classes and their related code together was all written in TypeScript.

### SASS

Because the styling concerns of the app were also relatively complex, it was the high time to leverage a CSS preprocessor. And I guess, SASS is the de facto in this regard, at least for me, for now. 

### `IndexedDB` (wrapped around my `FrontendDB` library)

When the time came to decide the database technology to use to persist the data of the app, I went with a frontend, browser-based solution, `IndexedDB`. *Have you heard about it?*

For a long time, I had known about `IndexedDB` but never really worked with it. It seemed to me like a killer feature that a JavaScript developer should definitely know of. And with this app, I finally got the opportunity to turn this into a reality.

First I spent a lot of time experimenting with the `IndexedDB` API in general. You know, it's a relatively low-level API based on a complex event system, and takes some time to get comfortable with. Once I became rock solid in it, I transitioned to integrate it into my app. 

(Well precisely speaking, first I built a wrapper library around `IndexedDB` to simplify working with it: [FrontendDB](https://github.com/bilalbro/frontend-db) and then integrated this library into my recipe-managing app. Quite ambitious, isn't this? 😊)
