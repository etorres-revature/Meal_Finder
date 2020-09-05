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
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
      .then((res) => res.json())
      .then((mealData) => {
        console.log(mealData);
        resultHeadingEl.innerHTML = `<h3>Search results for "${searchTerm}": </h3>`;

        //check to see if any meals with searchTerm
        if (mealData.meals === null) {
          resultHeadingEl.innerHTML = `<p>That search yielded no results.  Please try again!</p>`;
        } else {
          mealsEl.innerHTML = mealData.meals
            .map(
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
            .join("");
        }
      });
    //clear search text
    searchEl.value = "";
    searchEl.placeholder = "Search for meals by keywords...";
  } else {
    alert("Please enter search terms");
  }
}

//fetch meal by ID
function getMealByID(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((recipeData) => {
      const meal = recipeData.meals[0];

      addMealToDOM(meal);
    });
}

//add recipe to DOM
function addMealToDOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strMeasure${i}`]} - ${meal[`strIngredient${i}`]}`
      );
    } else {
      break;
    }
  }

  //
  single_mealEl.innerHTML = `
  <div class="sinigle-meal"
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
mealsEl.addEventListener("click", (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });

  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    getMealByID(mealID);
  }
});
