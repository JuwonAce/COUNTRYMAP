document.addEventListener("DOMContentLoaded", () => {
  // To select all necessary elements from the html file (DOM)
  const countriesList = document.getElementById("countries-list");
  const searchInput = document.getElementById("search");
  const regionFilter = document.getElementById("region-filter");
  const theme = document.getElementById("theme");
  const countryDetails = document.querySelector(".countrydetails");
  const countryInfo = document.getElementById("countryinfo");
  const borderCountries = document.getElementById("bordercountries");
  const backButton = document.getElementById("backButton");
  const countriesListContainer = document.querySelector(".countries-list");

  // To fetch data for all the countries from the API when the webpage loads (Also the homepage)
  const fetchCountries = async () => {
    try {
      const response = await fetch("https://restcountries.com/v3.1/all");
      const countries = await response.json();
      displayCountries(countries);  //This is the function used to display the fetched country data
    } catch (error) {
      console.error("Error fetching countries:", error); //This is to catch any error that may arise when fetching the country data
    }
  };

  // This is the function used to show countries as cards on the page
  const displayCountries = (countries) => {
    //clear the previous list of countries 
    countriesList.innerHTML = ''; 

    //To check through each country and create a card for each country
    countries.forEach(country => {
      const countryCard = document.createElement('div');
      countryCard.classList.add('country-card');
      countryCard.innerHTML = `
        <img src="${country.flags.png}" alt="${country.name.common}">
        <div class="details">
          <h2>${country.name.common}</h2>
          <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
          <p><strong>Region:</strong> ${country.region}</p>
          <p><strong>Capital:</strong> ${country.capital}</p>
        </div>
      `;
      //I used this to add a click effect (click event) to show details of any country that is being clicked on
      countryCard.addEventListener("click", () => showCountryDetails(country));
      countriesList.appendChild(countryCard);
    });
  };

  // This is the function used to show detailed information after a country is clicked on. 
  const showCountryDetails = (country) => {
    // Hide the list of countries and show the details section 
    countriesListContainer.style.display = 'none';
    countryDetails.style.display = 'block';

    // This shows everything that will be displayed as the detailed information for a selected country that is clicked on
    countryInfo.innerHTML = `
      <img src="${country.flags.png}" alt="${country.name.common}" class="country-flag">
      <h2>${country.name.common}</h2>
      <p><strong>Native Name:</strong> ${country.name.nativeName ? Object.values(country.name.nativeName)[0].common : country.name.common}</p>
      <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
      <p><strong>Region:</strong> ${country.region}</p>
      <p><strong>Sub Region:</strong> ${country.subregion}</p>
      <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
      <p><strong>Top Level Domain:</strong> ${country.tld}</p>
      <p><strong>Currency:</strong> ${country.currencies ? Object.values(country.currencies)[0].name : 'N/A'}</p>
      <p><strong>Languages:</strong> ${Object.values(country.languages).join(', ')}</p>
    `;

    // This is the function i used to display border countries if the selected country have a border
    borderCountries.innerHTML = '<h3>Border Countries:</h3>';
    if (country.borders && country.borders.length > 0) {
      //This creates a button for each bordering country
      country.borders.forEach(border => {
        const borderButton = document.createElement('button');
        borderButton.textContent = border;
        borderCountries.appendChild(borderButton);
      });
    } else {
      //If the selected country has no border, it will display the message below
      borderCountries.innerHTML += '<p>No border countries.</p>';
    }
  };

  // This function works for the back button, when it is clicked, it automatically takes the page back to the all country list
  backButton.addEventListener("click", () => {
    countryDetails.style.display = 'none';
    countriesListContainer.style.display = 'block';
  });

  // This function is used to filter countries by name based on the search input
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const countryCards = document.querySelectorAll('.country-card');

    // This function checks through the country cards and shows only those that match the search input/what is being entered by the user
    countryCards.forEach(card => {
      const countryName = card.querySelector('h2').textContent.toLowerCase();
      if (countryName.includes(searchTerm)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });

  // This function filters the country by region when the region fliter is changed 
  regionFilter.addEventListener('change', () => {
    const region = regionFilter.value;
    fetchCountriesByRegion(region);
  });

  // This function fetch countries based on the selected region
  const fetchCountriesByRegion = async (region) => {
    try {
      const response = region === 'all'
        ? await fetch('https://restcountries.com/v3.1/all') 
        : await fetch(`https://restcountries.com/v3.1/region/${region}`);
      const countries = await response.json();
      displayCountries(countries); 
    } catch (error) {
      console.error('Error fetching countries by region:', error);
    }
  };

  // This function changes the mode of the website from light mode to dark mode when clicked on but the default setting is light mode
  theme.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
      theme.textContent = '☀ Light Mode'; //Changes to light mode button text
    } else {
      theme.textContent = '🌙 Dark Mode'; //Changes to dark mode button text 
    }
  });

  // This fetch and displays countries when the page loads. 
  fetchCountries();
});
