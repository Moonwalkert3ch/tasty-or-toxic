document.addEventListener("DOMContentLoaded", function() {
    const apiURL = 'https://perenual.com/api/species-list?key=sk-eDLF66abb4c45921a6402&edible=1';
    const tableBody = document.getElementById('tableBody');
    const searchInput = document.getElementById('searchInput');
    const defaultPlaceholderURL = 'https://via.placeholder.com/150'; // Default placeholder image

    // Fetch data from API
    fetch(apiURL)
        .then(response => response.json())
        .then(data => populateTable(data.data));

    // Populate table with data
    function populateTable(data) {
        tableBody.innerHTML = '';
        data.forEach(item => {
            const firstImageURL = item.default_image.thumbnail;
            const secondImageURL = item.default_image.small_url;
            const thirdImageURL = item.default_image.medium_url;
            const fourthImageURL = item.default_image.regular_url;
            const fifthImageURL = item.default_image.original_url;

            const row = `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.common_name}</td>
                    <td>${item.scientific_name.join(', ')}</td>
                    <td>${item.other_name.join(', ')}</td>
                    <td>${item.cycle}</td>
                    <td>${item.watering}</td>
                    <td>${item.sunlight.join(', ')}</td>
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

    // Search feature
    searchInput.addEventListener('input', function() {
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
