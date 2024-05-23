document.addEventListener('DOMContentLoaded', function() {
    let currentCoordinates = null; 

    document.getElementById('dataForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = {
            field1: document.getElementById('direction').value,
            field2: document.getElementById('speed').value,
            coordinates: currentCoordinates 
        };

        fetch('http://example.com/api/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Ответ от сервера:', data);
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
    });

    initMap();

    async function initMap() {
        await ymaps3.ready;

        const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapListener} = ymaps3;
        const {YMapDefaultMarker} = await ymaps3.import('@yandex/ymaps3-markers@0.0.1');

        const map = new YMap(
            document.getElementById('map'),
            {
                location: {
                    center: [37.588144, 55.733842],
                    zoom: 10
                }
            }
        );

        let currentMarker = null; 

        // Функция для создания маркера
        const createMarker = (coord) => {
            if (currentMarker) {
                map.removeChild(currentMarker); 
            }
            currentMarker = new YMapDefaultMarker({
                coordinates: coord,
                color: '#006efc',
            });
            map.addChild(currentMarker); 
            currentCoordinates = coord; 
            document.getElementById('coordinatesOutput').innerText = `Coordinates: ${coord[0]} ${coord[1]}`; 
        }

        const clickCallback = (object, event) => {
            createMarker(event?.coordinates);
        }

        const mapListener = new YMapListener({
            layer: 'any',
            onClick: clickCallback,
        });

        map.addChild(mapListener);

        const featuresLayer = new YMapDefaultFeaturesLayer();
        map.addChild(featuresLayer);

        map.addChild(new YMapDefaultSchemeLayer());
    }
});