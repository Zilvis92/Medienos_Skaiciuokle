
let items = [];
let itemCounter = 0;

// Gauti elementus
const lengthInput = document.getElementById('length');
const widthInput = document.getElementById('width');
const thicknessInput = document.getElementById('thickness');
const woodTypeSelect = document.getElementById('wood-type');
const quantityInput = document.getElementById('quantity');
const addButton = document.getElementById('add-item');
const calculateButton = document.getElementById('calculate');
const resetButton = document.getElementById('reset');
const itemsList = document.getElementById('items-list');
const results = document.getElementById('results');

// Validacijos funkcija
function validateInput(input) {
    const value = parseFloat(input.value);
    const isValid = !isNaN(value) && value > 0;
    
    if (!isValid) {
        input.classList.add('error');
        input.nextElementSibling.classList.add('show');
    } else {
        input.classList.remove('error');
        input.nextElementSibling.classList.remove('show');
    }
    
    return isValid;
}

// Tikrinti visus įvesties laukus
function checkAllInputs() {
    const lengthValid = validateInput(lengthInput);
    const widthValid = validateInput(widthInput);
    const thicknessValid = validateInput(thicknessInput);
    const quantityValid = validateInput(quantityInput);
    
    const allValid = lengthValid && widthValid && thicknessValid && quantityValid;
    addButton.disabled = !allValid;
    
    return allValid;
}

// Pridėti įvykių klausytojus
[lengthInput, widthInput, thicknessInput, quantityInput].forEach(input => {
    input.addEventListener('input', checkAllInputs);
    input.addEventListener('blur', checkAllInputs);
});

// Pridėti elementą
addButton.addEventListener('click', function() {
    if (!checkAllInputs()) return;

    const length = parseFloat(lengthInput.value);
    const width = parseFloat(widthInput.value);
    const thickness = parseFloat(thicknessInput.value);
    const woodType = woodTypeSelect.options[woodTypeSelect.selectedIndex].text;
    const pricePerM3 = parseFloat(woodTypeSelect.value);
    const quantity = parseInt(quantityInput.value);

    // Skaičiavimai
    const volumePerItem = length * width * thickness;
    const totalVolume = volumePerItem * quantity;
    const totalPrice = totalVolume * pricePerM3;

    const item = {
        id: ++itemCounter,
        length,
        width,
        thickness,
        woodType,
        pricePerM3,
        quantity,
        volumePerItem,
        totalVolume,
        totalPrice
    };

    items.push(item);
    updateItemsList();
    
    // Animacija sėkmės atveju
    addButton.style.transform = 'scale(0.95)';
    setTimeout(() => {
        addButton.style.transform = 'scale(1)';
    }, 150);
});

// Atnaujinti elementų sąrašą
function updateItemsList() {
    if (items.length === 0) {
        itemsList.innerHTML = `
            <p class="empty-list-message">
                Elementų sąrašas tuščias. Pridėkite pirmus elementus aukščiau.
            </p>
        `;
        return;
    }

    itemsList.innerHTML = items.map(item => `
        <div class="item">
            <div class="item-info">
                <strong>${item.woodType}</strong><br>
                <small>
                    ${item.length}m × ${item.width}m × ${item.thickness}m × ${item.quantity} vnt.<br>
                    Kubatūra: ${item.totalVolume.toFixed(4)} m³ | 
                    Kaina: ${item.totalPrice.toFixed(2)} €
                </small>
            </div>
            <button class="remove-item" onclick="removeItem(${item.id})">
                🗑️ Šalinti
            </button>
        </div>
    `).join('');
}

// Šalinti elementą
function removeItem(id) {
    items = items.filter(item => item.id !== id);
    updateItemsList();
    if (items.length === 0) {
        updateResults();
    }
}

// Skaičiuoti bendrą
calculateButton.addEventListener('click', function() {
    updateResults();
});

// Atnaujinti rezultatus
function updateResults() {
    if (items.length === 0) {
        results.innerHTML = `
            <div class="result-item">
                <p>Kol kas nėra skaičiavimų. Pridėkite elementų ir spauskite "Skaičiuoti bendrą".</p>
            </div>
        `;
        return;
    }

    const totalVolume = items.reduce((sum, item) => sum + item.totalVolume, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const averagePricePerM3 = totalPrice / totalVolume;

    // Suskirstyti pagal medienos rūšis
    const byWoodType = {};
    items.forEach(item => {
        const type = item.woodType;
        if (!byWoodType[type]) {
            byWoodType[type] = { volume: 0, price: 0, count: 0 };
        }
        byWoodType[type].volume += item.totalVolume;
        byWoodType[type].price += item.totalPrice;
        byWoodType[type].count += item.quantity;
    });

    results.innerHTML = `
        <div class="result-highlight">
            <strong>🎯 BENDRA INFORMACIJA</strong><br>
            Bendras kiekis: ${totalItems} lentų<br>
            Bendra kubatūra: ${totalVolume.toFixed(4)} m³<br>
            <strong>Bendra kaina: ${totalPrice.toFixed(2)} €</strong>
        </div>
        
        <div class="result-item">
            <strong>📈 Papildoma statistika:</strong><br>
            • Vidutinė kaina už m³: ${averagePricePerM3.toFixed(2)} €<br>
            • Vidutinė kaina už lentą: ${(totalPrice / totalItems).toFixed(2)} €<br>
            • Skirtingų elementų tipų: ${items.length}
        </div>

        <div class="result-item">
            <strong>🌳 Pagal medienos rūšis:</strong><br>
            ${Object.entries(byWoodType).map(([type, data]) => 
                `• ${type}: ${data.volume.toFixed(4)} m³, ${data.count} lentų - ${data.price.toFixed(2)} €`
            ).join('<br>')}
        </div>

        <div class="result-item">
            <strong>💡 Patarimai:</strong><br>
            ${totalVolume > 1 ? '• Didelis kiekis - galbūt galima derėtis dėl didmenų kainos' : ''}
            ${totalVolume > 1 ? '<br>' : ''}• Atsižvelkite į transportavimo kaštus<br>
            • Rekomenduojame įsigyti 5-10% daugiau medžiagos atsargai
        </div>
    `;
}

// Išvalyti viską
resetButton.addEventListener('click', function() {
    // Išvalyti formos laukus
    lengthInput.value = '3.0';
    widthInput.value = '0.15';
    thicknessInput.value = '0.05';
    quantityInput.value = '10';
    woodTypeSelect.selectedIndex = 0;

    // Išvalyti klaidas
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.error-message.show').forEach(el => el.classList.remove('show'));

    // Išvalyti duomenis
    items = [];
    itemCounter = 0;
    
    updateItemsList();
    updateResults();
    checkAllInputs();

    // Animacija
    resetButton.style.transform = 'scale(0.95)';
    setTimeout(() => {
        resetButton.style.transform = 'scale(1)';
    }, 150);
});

// Pradinis patikrinimas
checkAllInputs();

// Atnaujinti rezultatus kas kartą, kai keičiasi elementų sąrašas
window.removeItem = removeItem;
