
const request = async () => {
    const url = 'http://localhost:3000/api/total'
    const results = await fetch(url)
        .then(response => response.json())
    return results.data;
}

const mayorA10Mil = async () => {
    const data =  await request();
    const mayoresA10Mil = data.filter(pais => {
     const confirmado = pais.confirmed > 2000000
     return confirmado
   })
   return mayoresA10Mil
}

/*---------------TABLA----------*/
const imprimirTabla = async () => {
    const data = await request();
    const tabla = document.getElementById('tabla')
    
    var texto ="<thead class='thead-light'><th>Pais</th><th>Confirmados</th><th>Muertes</th><th>Recuperados</th><th>Activos</th><th>Detalle</th></thead>";
        for (var i = 0; i < data.length; i++) {
                   
                texto += `<tr>
                        <td>${data[i].location}</td>
                        <td>${data[i].confirmed}</td>
                        <td>${data[i].deaths}</td>
                        <td>${data[i].recovered}</td>
                        <td>${data[i].active}</td>
                        <td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#${data[i].location}">
                        Ver detalles
                      </button></td>
                    </tr>`;
        }
        //se imprime la tabla en el documento html y se imprimen los datos del primer y ultimo paciente 
        tabla.innerHTML =`<table class="table">${texto}</table><hr>`
    }
imprimirTabla()
/*--------------GRAFICA-------------*/
window.onload = async () => {
    const data = await mayorA10Mil()
    console.log(data)
    let confirmados = []
    let muertos = []
    let recuperados = []
    let activos = []
                
        data.forEach(function(s){
            confirmados.push({
                label: s.location,
                y: s.confirmed
            })
            muertos.push({
                label: s.location,
                y: s.deaths
            })
            recuperados.push({
                label: s.location,
                y: s.recovered
            })
            activos.push({
                y: s.active
            })
        })
        let config = {
            title:{
                text: "Paises con Covid19"
            }, 
            axisX: {
                labelAngle: -30,
                labelFontSize: 12,
                interval: 1
            },
                        
            toolTip: {
                shared: true
            },
            legend: {
                cursor: "pointer",
                itemclick: toggleDataSeries
            },
            data: [{
                type: "column",
                name: "Confirmados",
                showInLegend: true,      
                yValueFormatString: "#,##0.# Casos",
                dataPoints: confirmados
                
            },
            {
                type: "column",
                name: "Muertes",
                axisYType: "secondary",
                showInLegend: true,
                yValueFormatString: "#,##0.# Casos",
                dataPoints: muertos
            },
            {
                type: "column",
                name: "Recuperados",
                axisYType: "secondary",
                showInLegend: true,
                yValueFormatString: "#,##0.# Casos",
                dataPoints: recuperados
            },
            {
                type: "column",
                name: "Activos",
                axisYType: "secondary",
                showInLegend: true,
                yValueFormatString: "#,##0.# Casos",
                dataPoints: activos
            }
        ]
        }

        
        let chart = new CanvasJS.Chart("chartContainer", config); 
        
chart.render();

    
    
    function toggleDataSeries(e) {
        if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        }
        else {
            e.dataSeries.visible = true;
        }
        chart.render();
    }
    
    }