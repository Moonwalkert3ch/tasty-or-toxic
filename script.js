let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}

// Fetch API and Pagination
document.addEventListener("DOMContentLoaded", function () {
  const apiKey = 'sk-r7GO66b149f0237136439';
  const apiBaseURL = 'https://perenual.com/api/species-list?key=' + apiKey;
  const tableBody = document.getElementById('tableBody');
  const searchInput = document.getElementById('searchInput');
  const sortBy = document.getElementById('sort-by');
  const plantsSection = document.getElementById('plants-section');
  const pagination = document.getElementById('pagination');
  const defaultPlaceholderURL = 'https://via.placeholder.com/150'; // Default placeholder image

  let currentPage = 1;
  const resultsPerPage = 7;
  let totalPages = 0;
  let allData = [];

  sortBy.addEventListener('change', function () {
    const selectedOption = sortBy.value;
    tableBody.innerHTML = ''; // Clear table before new data is loaded
    currentPage = 1; // Reset to first page
    fetchData(selectedOption);
  });

  function fetchData(option) {
    let url;
    if (option === 'poisonous') {
      url = apiBaseURL + '&poisonous=1';
    } else if (option === 'edible') {
      url = apiBaseURL + '&edible=1';
    } else if (option === 'all') {
      Promise.all([
        fetch(apiBaseURL + '&poisonous=1').then(response => response.json()),
        fetch(apiBaseURL + '&edible=1').then(response => response.json())
      ]).then(([poisonousData, edibleData]) => {
        allData = [...poisonousData.data, ...edibleData.data];
        totalPages = Math.ceil(allData.length / resultsPerPage);
        populateTable();
        setupPagination();
      }).catch(error => console.error('Error fetching data:', error));
      return;
    } else {
      plantsSection.style.display = 'none';
      return;
    }

    fetch(url)
      .then(response => response.json())
      .then(data => {
        allData = data.data;
        totalPages = Math.ceil(allData.length / resultsPerPage);
        populateTable();
        setupPagination();
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  function populateTable() {
    tableBody.innerHTML = '';
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = Math.min(startIndex + resultsPerPage, allData.length);
    const dataToDisplay = allData.slice(startIndex, endIndex);

    dataToDisplay.forEach(item => {
      const firstImageURL = item.default_image ? item.default_image.thumbnail : defaultPlaceholderURL;
      const secondImageURL = item.default_image ? item.default_image.small_url : defaultPlaceholderURL;
      const thirdImageURL = item.default_image ? item.default_image.medium_url : defaultPlaceholderURL;
      const fourthImageURL = item.default_image ? item.default_image.regular_url : defaultPlaceholderURL;
      const fifthImageURL = item.default_image ? item.default_image.original_url : defaultPlaceholderURL;

      const danger = item.danger ? item.danger : 'No data available';
      const firstAidTips = item.first_aid ? item.first_aid : 'No data available';

      const row = `
        <tr>
          <td>${item.id}</td>
          <td>${item.common_name}</td>
          <td>${item.scientific_name.join(', ')}</td>
          <td>${item.other_name.join(', ')}</td>
          <td>${item.cycle}</td>
          <td>
            <img src="${firstImageURL}" 
                 alt="${item.common_name}" 
                 class="img-thumbnail" 
                 onerror="this.onerror=null;this.src='${secondImageURL}';this.onerror=function(){this.src='${thirdImageURL}';this.onerror=function(){this.src='${fourthImageURL}';this.onerror=function(){this.src='${fifthImageURL}';this.onerror=function(){this.src='${defaultPlaceholderURL}';};};};};">
          </td>
        
        </tr>
      `;
      tableBody.insertAdjacentHTML('beforeend', row);
    });
  }

  function setupPagination() {
    pagination.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement('li');
      button.className = 'page-item';
      button.innerHTML = `<a class="page-link" href="#">${i}</a>`;
      button.addEventListener('click', function (event) {
        event.preventDefault();
        currentPage = i;
        populateTable();
        updatePagination();
      });
      pagination.appendChild(button);
    }
    updatePagination();
  }

  function updatePagination() {
    const buttons = pagination.getElementsByClassName('page-item');
    Array.from(buttons).forEach(button => {
      button.classList.remove('active');
      if (button.textContent == currentPage) {
        button.classList.add('active');
      }
    });
  }

  // Search feature
  searchInput.addEventListener('input', function () {
    const searchTerm = searchInput.value.toLowerCase();
    const rows = tableBody.getElementsByTagName('tr');
    Array.from(rows).forEach(row => {
      const cells = row.getElementsByTagName('td');
      const rowText = Array.from(cells).map(cell => cell.textContent.toLowerCase()).join(' ');
      if (rowText.includes(searchTerm)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
});


