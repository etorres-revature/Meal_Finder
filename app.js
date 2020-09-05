//MealDB API
// https://www.themealdb.com/api.php

//global variables for DOM elements
const searchEl = document.querySelector("#search-input"),
  submitForm = document.querySelector("#submit-form"),
  randomBtn = document.querySelector("#random-btn"),
  mealsEl = document.querySelector("#meals"),
  resultHeadingEl = document.querySelector("#result-heading"),
  single_mealEl = document.querySelector("#single-meal");

//seach for meal and fetch from API
function searchMeal(e) {
  e.preventDefault();

  //clear single meal
  single_mealEl.innerHTML = "";

  //get search term
  const searchTerm = searchEl.value;
  //   console.log(term)

  //check for null input
  if (searchTerm.trim()) {
    //search URL with fetch API
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
      //JS promise returned as JSON
      .then((res) => res.json())
      //JS promise with data
      .then((mealData) => {
        // console.log(mealData);
        //adding the heading with the Search Term included
        resultHeadingEl.innerHTML = `<h3>Search results for "${searchTerm}": </h3>`;

        //check to see if any meals with searchTerm
        if (mealData.meals === null) {
          //adding heading with no search terms
          resultHeadingEl.innerHTML = `<p>That search yielded no results.  Please try again!</p>`;
        } else {
          //dynamically adding information to meals id from HTML with map through the returned array
          mealsEl.innerHTML = mealData.meals
            .map(
              //template literal to dynamiccaly include html through the map funciton
              (meal) => `
            <div class="meal">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
            <div class="meal-info" data-mealID="${meal.idMeal}">
            <h3>${meal.strMeal}
            </h3>
            </div>
            </div>
            `
            )
            //taking the array and turning into a string
            .join("");
        }
      });
    //clear search text
    searchEl.value = "";
    //add placeholder text again
    searchEl.placeholder = "Search for meals by keywords...";
    //else logic for what to do if there were no search terms entered
  } else {
    alert("Please enter search terms");
  }
}

//fetch meal by ID
function getMealByID(mealID) {
  //fetch API with meal ID included
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    //JS promise returning response and turning it into JSON
    .then((res) => res.json())
    //JS promise with JSON data
    .then((recipeData) => {
      //setting a variable to contain the returned meal from its place in the array
      const meal = recipeData.meals[0];

      //function to add meal to DOM
      addMealToDOM(meal);
    });
}

//fetch random meal from API
function getRandomMeal() {
  //clear meals and heading
  mealsEl.innerHTML = "";
  resultHeadingEl.innerHTML = "";
  //fetch API used to get random meal
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    //JS promise turning response into JSON
    .then((res) => res.json())
    //JS promise using JSON
    .then((randomData) => {
      // console.log(randomData);
      //variable to put random meal information from array into a variable
      const meal = randomData.meals[0];

      //funciton to add meal to DOM
      addMealToDOM(meal);
    });
}

//add recipe to DOM
function addMealToDOM(meal) {
  //empty array to hold ingredients
  const ingredients = [];

  //for loop to go over list of returned ingredients and measurements
  //no more than twenty returned
  for (let i = 1; i <= 20; i++) {
    //logic for if there is an ingredient in the JSON
    if (meal[`strIngredient${i}`]) {
      //add ingreadient and measurement to the end of the ingredients array
      ingredients.push(
        `${meal[`strMeasure${i}`]} - ${meal[`strIngredient${i}`]}`
      );
      //logic for what to do if there is no ingredient/measurement
    } else {
      //end the function
      break;
    }
  }

  //adding inner HTML to display the image, directions, and ingredients
  single_mealEl.innerHTML = `
  <div class="single-meal">
    <h2>${meal.strMeal}</h2>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
    <div class="single-meal-info"> 
         ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
         ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
    </div>
    <div class="main">
         <p>${meal.strInstructions}</p>
    <h3>Ingredients</h2>
         <ul>
            ${ingredients
              .map((ingredient) => `<li>${ingredient}</li>`)
              .join("")}
        </ul>
    </div>
  </div>
  `;
}

//add event listeners
//action to complete when the form is submitted
submitForm.addEventListener("submit", searchMeal);
//get random meal
randomBtn.addEventListener("click", getRandomMeal);

//get meal by id for selected meal returned from search
mealsEl.addEventListener("click", (e) => {
    //setting a variable mealinfo to see if the selected item has that class
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
        //meal-info dynamically added in search meal function
      return item.classList.contains("meal-info");
      //returning false if there is no class meal-info
    } else {
      return false;
    }
  });

  //if there is the class meal-info then this is logic to use the mealid dynamically added
  //in the search meal function to get meal by ID and display image, directions, and ingredient/measurements
  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    getMealByID(mealID);
  }
});
